import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserDto } from "@active-resume/dto";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class OptionalGuard extends AuthGuard("two-factor") {
  getRequest(context: ExecutionContext) {
    // 1. Create a GqlExecutionContext
    const gqlContext = GqlExecutionContext.create(context);

    // 2. Get the underlying request object from the GraphQL context
    const request = gqlContext.getContext().req;

    return request;
  }
  handleRequest<TUser = UserDto>(error: Error, user: TUser): TUser {
    return user;
  }
}
