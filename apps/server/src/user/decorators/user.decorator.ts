import { UserWithSecrets } from "@active-resume/dto";
import { type ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { User as UserEntity } from "@prisma/client";

export const User = createParamDecorator((data: keyof UserEntity, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  const req = gqlCtx.getContext().req;

  return data ? (req.user[data] as UserEntity) : (req.user as UserEntity);
});

export const restUser = createParamDecorator(
  (data: keyof UserWithSecrets | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserWithSecrets;

    return data ? user[data] : user;
  },
);
