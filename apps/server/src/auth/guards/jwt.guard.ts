import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  // Override to get the request from GraphQL context as passport cant access it like in a REST context
  getRequest(context: ExecutionContext) {
    // 1. Create a GqlExecutionContext
    const gqlContext = GqlExecutionContext.create(context);

    // 2. Get the underlying request object from the GraphQL context
    const request = gqlContext.getContext().req;

    return request;
  }
}
