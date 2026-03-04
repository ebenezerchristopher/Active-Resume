import type { Resume, User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: PrismaUser;
      payload?: {
        resume: Resume;
      };
    }
  }
}

export {};
