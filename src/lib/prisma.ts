type PrismaLikeUser = {
  id: string;
  name: string | null;
  email: string;
  passwordHash: string;
};

type PrismaLikeUserCreateArgs = {
  data: {
    email: string;
    name: string;
    passwordHash: string;
    profile?: { create?: { displayName?: string } };
  };
  select?: {
    id?: boolean;
    name?: boolean;
    email?: boolean;
  };
};

type PrismaLikeUserFindUniqueArgs = {
  where: { email: string };
};

type PrismaLikeClient = {
  user: {
    create: (args: PrismaLikeUserCreateArgs) => Promise<Partial<PrismaLikeUser>>;
    findUnique: (args: PrismaLikeUserFindUniqueArgs) => Promise<PrismaLikeUser | null>;
  };
};

type GlobalPrismaClient = typeof globalThis & {
  prismaClient?: PrismaLikeClient;
};

const memoryUsers = new Map<string, PrismaLikeUser>();
let nextUserId = 1;

function createMemoryPrismaClient(): PrismaLikeClient {
  return {
    user: {
      async create(args: PrismaLikeUserCreateArgs): Promise<Partial<PrismaLikeUser>> {
        const existingUser = Array.from(memoryUsers.values()).find((user) => user.email === args.data.email);
        if (existingUser) {
          const duplicateError = new Error('Unique constraint failed on the fields: (`email`)') as Error & { code?: string };
          duplicateError.code = 'P2002';
          throw duplicateError;
        }

        const user: PrismaLikeUser = {
          id: `user_${nextUserId++}`,
          name: args.data.name,
          email: args.data.email,
          passwordHash: args.data.passwordHash,
        };

        memoryUsers.set(user.id, user);

        const select = args.select ?? { id: true, name: true, email: true };
        return {
          ...(select.id ? { id: user.id } : {}),
          ...(select.name ? { name: user.name } : {}),
          ...(select.email ? { email: user.email } : {}),
        };
      },
      async findUnique(args: PrismaLikeUserFindUniqueArgs): Promise<PrismaLikeUser | null> {
        return Array.from(memoryUsers.values()).find((user) => user.email === args.where.email) ?? null;
      },
    },
  };
}

function createPrismaClient(): PrismaLikeClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client') as { PrismaClient: new () => PrismaLikeClient };
    return new PrismaClient();
  } catch {
    return createMemoryPrismaClient();
  }
}

const globalPrisma = globalThis as GlobalPrismaClient;
const prismaClient = globalPrisma.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalPrisma.prismaClient = prismaClient;
}

export { prismaClient };
export default prismaClient;
