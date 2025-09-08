import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  // Override to get the request from GraphQL context as passport cant access it like in a REST context
  getRequest(context: ExecutionContext) {
    // 1. Create a GqlExecutionContext
    const gqlContext = GqlExecutionContext.create(context);

    // 2. Get the underlying request object from the GraphQL context
    const request = gqlContext.getContext().req;

    // 3. Get the arguments from the GraphQL mutation
    const { identifier, password } = gqlContext.getArgs().data; // Adjust based on your mutation's input name

    // 4. Attach the arguments to the request body
    //    The LocalStrategy by default looks for 'username' and 'password' in the request body.
    //    We are manually creating `request.body` to make our strategy work seamlessly.
    request.body = { identifier, password };

    // 5. Return the modified request object
    return request;
  }
}
