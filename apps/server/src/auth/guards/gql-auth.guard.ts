import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'nestjs-prisma';

/**
 * Temporary Auth Guard for Testing.
 * It retrieves a hardcoded user from the database to simulate an authenticated session.
 * This will be replaced by a proper JWT guard.
 */
@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    // In a real scenario, we would validate a JWT.
    // For testing, we fetch the seeded user and attach it to the request.
    const user = await this.prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    if (user) {
      req.user = user;
      return true;
    }

    // Deny access if the test user is not found.
    return false;
  }
}
