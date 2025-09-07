import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { UserWithSecrets } from '@active-resume/dto';
import { ErrorMessage } from '@active-resume/utils';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string): Promise<UserWithSecrets> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { secrets: true },
    });

    if (!user.secrets) {
      throw new InternalServerErrorException(ErrorMessage.SecretsNotFound);
    }

    return user;
  }

  async findOneByIdentifier(
    identifier: string
  ): Promise<UserWithSecrets | null> {
    return this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
      include: { secrets: true },
    });
  }

  async findOneByIdentifierOrThrow(
    identifier: string
  ): Promise<UserWithSecrets> {
    return this.prisma.user.findFirstOrThrow({
      where: { OR: [{ email: identifier }, { username: identifier }] },
      include: { secrets: true },
    });
  }

  create(data: Prisma.UserCreateInput): Promise<UserWithSecrets> {
    return this.prisma.user.create({ data, include: { secrets: true } });
  }

  updateByEmail(
    email: string,
    data: Prisma.UserUpdateArgs['data']
  ): Promise<User> {
    return this.prisma.user.update({ where: { email }, data });
  }

  async deleteOneById(id: string): Promise<void> {
    // Storage deletion logic will be added in a later ticket when StorageModule is implemented
    await this.prisma.user.delete({ where: { id } });
  }
}
