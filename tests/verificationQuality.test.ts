import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { describe, expect, it } from 'vitest';

const execFileAsync = promisify(execFile);
const PROJECT_ROOT = '/home/dudu/Workspace/projects/agent-workflow';
const COMMAND_TIMEOUT_MILLISECONDS = 120_000;

type VerificationCommandResult = {
  exitCode: number;
  output: string;
};

async function runVerificationCommand(command: string, args: string[]): Promise<VerificationCommandResult> {
  try {
    const result = await execFileAsync(command, args, {
      cwd: PROJECT_ROOT,
      timeout: COMMAND_TIMEOUT_MILLISECONDS,
      env: process.env,
    });

    return {
      exitCode: 0,
      output: `${result.stdout}${result.stderr}`,
    };
  } catch (error: unknown) {
    if (isCommandFailure(error)) {
      return {
        exitCode: typeof error.code === 'number' ? error.code : 1,
        output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
      };
    }

    throw error;
  }
}

function isCommandFailure(error: unknown): error is NodeJS.ErrnoException & {
  stdout?: string;
  stderr?: string;
} {
  return error instanceof Error;
}

describe('Verification quality gates', () => {
  it('should complete the ESLint source gate when final verification runs', async () => {
    const result = await runVerificationCommand('npx', ['eslint', 'src/']);

    expect(result.output).not.toContain('Could not find config file');
    expect(result.exitCode).toBe(0);
  });

  it('should typecheck the MCP server entrypoint when final verification runs', async () => {
    const result = await runVerificationCommand('npx', ['tsc', '--noEmit', '--pretty', 'false']);

    expect(result.output).not.toContain('src/server.ts');
    expect(result.exitCode).toBe(0);
  });

  it('should typecheck the MCP tool contract tests when final verification runs', async () => {
    const result = await runVerificationCommand('npx', ['tsc', '--noEmit', '--pretty', 'false']);

    expect(result.output).not.toContain('tests/mcpTools.test.ts');
    expect(result.exitCode).toBe(0);
  });
});
