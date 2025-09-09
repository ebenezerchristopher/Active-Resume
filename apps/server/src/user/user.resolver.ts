import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User as CurrentUser } from './decorators/user.decorator';
import { UserDto } from '@active-resume/dto';
import { UserEntity } from './entities';
import { UpdateUserInput } from './entities';
import { Message } from '../shared/dto/message.dto';
import { ErrorMessage } from '@active-resume/utils';
import { UserService } from './user.service';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => UserEntity, { name: 'me' })
  @UseGuards(JwtGuard)
  me(@CurrentUser() user: UserDto) {
    // Use the Zod schema to strip out secrets and ensure the correct shape
    return user;
  }

  @Mutation(() => UserEntity, { name: 'updateMe' })
  @UseGuards(JwtGuard)
  async updateMe(
    @CurrentUser() user: UserDto,
    @Args('data') data: UpdateUserInput
  ): Promise<UserEntity> {
    try {
      // Email change requires verification, so it will be handled in the Auth sprint.
      // For now, we prevent it.
      if (data.email && data.email !== user.email) {
        throw new BadRequestException('Email updates are not yet supported.');
      }

      const updatedUser = await this.userService.updateByEmail(user.email, {
        name: data.name,
        locale: data.locale,
        username: data.username,
        picture: data.picture,
      });

      return updatedUser;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(ErrorMessage.UserAlreadyExists);
      }

      Logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  @Mutation(() => Message)
  @UseGuards(JwtGuard)
  async deleteMe(@CurrentUser() user: UserDto): Promise<Message> {
    await this.userService.deleteOneById(user.id);

    // Clearing cookies will be handled in the Auth sprint's logout mutation.

    return {
      message:
        'Your account has been successfully deleted. Sorry to see you go!',
    };
  }
}
