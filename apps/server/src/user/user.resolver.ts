import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { User } from "./decorators/user.decorator";
import { UserDto } from "@active-resume/dto";
import { UserEntity } from "./entities";
import { UpdateUserInput } from "./entities";
import { Message } from "../shared/dto/message.dto";
import { ErrorMessage } from "@active-resume/utils";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { Response } from "express";

@Resolver()
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Query(() => UserEntity, { name: "me" })
  @UseGuards(JwtGuard)
  me(@User() user: UserDto) {
    // Use the Zod schema to strip out secrets and ensure the correct shape
    return user;
  }

  @Mutation(() => UserEntity, { name: "updateMe" })
  @UseGuards(JwtGuard)
  async updateMe(
    @User("email") email: string,
    @Args("data") data: UpdateUserInput,
  ): Promise<UserEntity> {
    try {
      // If user is updating their email, send a verification email
      if (data.email && data.email !== email) {
        await this.userService.updateByEmail(email, {
          emailVerified: false,
          email: data.email,
        });

        await this.authService.sendVerificationEmail(data.email);

        email = data.email;
      }

      return await this.userService.updateByEmail(email, {
        name: data.name,
        locale: data.locale,
        username: data.username,
        picture: data.picture,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Mutation(() => Message, { name: "delete" })
  @UseGuards(JwtGuard)
  async deleteMe(
    @User("id") id: string,
    @Context() { res: response }: { res: Response },
  ): Promise<Message> {
    await this.userService.deleteOneById(id);

    response.clearCookie("Authentication");
    response.clearCookie("Refresh");

    return {
      message: "Your account has been successfully deleted. Sorry to see you go!",
    };
  }
}
