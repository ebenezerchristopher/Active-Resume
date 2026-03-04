import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { UserWithSecrets } from "@active-resume/dto";
import { ErrorMessage } from "@active-resume/utils";
import { Request } from "express";

import { ResumeService } from "../resume.service";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class ResumeGuard implements CanActivate {
  constructor(private readonly resumeService: ResumeService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Create a GqlExecutionContext
    const gqlContext = GqlExecutionContext.create(context);

    // 2. Get the underlying request object from the GraphQL context
    const request = gqlContext.getContext().req as Request;

    const user = request.user as UserWithSecrets | false;

    try {
      const resume = await this.resumeService.findOne(
        request.query.id as string,
        user ? user.id : undefined,
      );

      // First check if the resume is public, if yes, attach the resume to the request payload.
      if (resume.visibility === "public") {
        request.payload = { resume };
      }

      // If the resume is private and the user is authenticated and is the owner of the resume, attach the resume to the request payload.
      // Else, if either the user is not authenticated or is not the owner of the resume, throw a 404 error.
      if (resume.visibility === "private") {
        if (user && user.id === resume.userId) {
          request.payload = { resume };
        } else {
          throw new NotFoundException(ErrorMessage.ResumeNotFound);
        }
      }

      return true;
    } catch {
      throw new NotFoundException(ErrorMessage.ResumeNotFound);
    }
  }
}
