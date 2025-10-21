import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { ResumeService } from "./resume.service";
import { ResumeEntity } from "./entities/resume.entity";
import { CreateResumeInput, ImportResumeInput, UpdateResumeInput } from "./entities/resume.input";
import { User } from "@/server/user/decorators/user.decorator";
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from "@nestjs/common";
import { TwoFactorGuard } from "@/server/auth/guards/two-factor.guard";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorMessage } from "@active-resume/utils";
import { Request } from "express";
import { importResumeSchema } from "@active-resume/dto";

@Resolver()
export class ResumeResolver {
  constructor(private readonly resumeService: ResumeService) {}

  @Mutation(() => ResumeEntity)
  @UseGuards(TwoFactorGuard)
  async createResume(@User("id") id: string, @Args("data") data: CreateResumeInput) {
    try {
      return await this.resumeService.create(id, data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ErrorMessage.ResumeSlugAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Query(() => [ResumeEntity], { name: "resume" })
  @UseGuards(TwoFactorGuard)
  findAll(@User("id") id: string) {
    return this.resumeService.findAll(id);
  }

  @Mutation(() => ResumeEntity)
  @UseGuards(TwoFactorGuard)
  async importResume(@User("id") id: string, @Args("data") data: ImportResumeInput) {
    try {
      const result = importResumeSchema.parse(data);
      return await this.resumeService.import(id, result);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ErrorMessage.ResumeSlugAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Mutation(() => ResumeEntity)
  @UseGuards(TwoFactorGuard)
  updateResume(
    @User("id") userId: string,
    @Context() { req }: { req: Request },
    @Args("data") data: UpdateResumeInput,
  ) {
    return this.resumeService.update(userId, req.query.id as string, data);
  }

  @Mutation(() => ResumeEntity)
  @UseGuards(TwoFactorGuard)
  lockResume(
    @User("id") userId: string,
    @Context() { req }: { req: Request },
    @Args("set") set: boolean,
  ) {
    return this.resumeService.lock(userId, req.query.id as string, set);
  }

  @Mutation(() => ResumeEntity)
  @UseGuards(TwoFactorGuard)
  deleteResume(@User("id") userId: string, @Context() { req }: { req: Request }) {
    return this.resumeService.remove(userId, req.params.id);
  }
}
