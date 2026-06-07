import { createServer } from 'node:net';

import { defineConfig, devices } from '@playwright/test';

const host = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const portCandidates = [
  Number(process.env.PLAYWRIGHT_PORT ?? process.env.PORT ?? 3000),
  3001,
  3002,
  3003,
  3004,
  3005,
];
const databaseUrl = process.env.PLAYWRIGHT_DATABASE_URL ?? process.env.DATABASE_URL;
const isContinuousIntegration = Boolean(process.env.CI);

async function isPortAvailable(port: number): Promise<boolean> {
  return await new Promise((resolve) => {
    const server = createServer();

    server.once('error', () => {
      resolve(false);
    });

    server.once('listening', () => {
      server.close(() => resolve(true));
    });

    server.listen(port, host);
  });
}

async function selectPort(): Promise<number> {
  for (const candidatePort of portCandidates) {
    if (await isPortAvailable(candidatePort)) {
      return candidatePort;
    }
  }

  throw new Error(`No available Playwright web server port found for ${host}`);
}

const selectedPort = process.env.PLAYWRIGHT_PORT
  ? Number(process.env.PLAYWRIGHT_PORT)
  : await selectPort();

process.env.PLAYWRIGHT_PORT = String(selectedPort);

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${selectedPort}`;
process.env.PLAYWRIGHT_BASE_URL = baseURL;

export default defineConfig({
  testDir: './src/e2e',
  fullyParallel: false,
  forbidOnly: true,
  retries: isContinuousIntegration ? 2 : 0,
  workers: 1,
  reporter: isContinuousIntegration ? [['github'], ['html']] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: databaseUrl
      ? `sh -c 'npm run db:push && npm run db:seed && npm run dev -- --hostname ${host} --port ${selectedPort}'`
      : `sh -c 'npm run dev -- --hostname ${host} --port ${selectedPort}'`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      NEXT_TELEMETRY_DISABLED: '1',
      PLAYWRIGHT_E2E: '1',
    },
  },
});
