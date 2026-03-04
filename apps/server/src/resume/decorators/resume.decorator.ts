import type { ExecutionContext } from "@nestjs/common";
import { createParamDecorator } from "@nestjs/common";
import type { ResumeDto } from "@active-resume/dto";
import { GqlExecutionContext } from "@nestjs/graphql";

export const Resume = createParamDecorator(
  (data: keyof ResumeDto | undefined, ctx: ExecutionContext) => {
    // 1. Create a GqlExecutionContext
    const gqlContext = GqlExecutionContext.create(ctx);

    // 2. Get the underlying request object from the GraphQL context
    const request = gqlContext.getContext().req;

    const resume = request.payload?.resume as ResumeDto;

    return data ? resume[data] : resume;
  },
);
