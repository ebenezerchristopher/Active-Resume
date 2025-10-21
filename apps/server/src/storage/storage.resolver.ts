import { Resolver, Mutation, Args } from "@nestjs/graphql";
import { StorageService } from "./storage.service";
import { BadRequestException, Logger, UseGuards } from "@nestjs/common";
import { TwoFactorGuard } from "@/server/auth/guards/two-factor.guard";
import { User } from "@/server/user/decorators/user.decorator";
import { UploadScalar } from "./entities/storage.entity";
import { FileUpload } from "graphql-upload-ts";
import { buffer } from "node:stream/consumers";

@Resolver()
export class StorageResolver {
  constructor(private readonly storageService: StorageService) {}

  @Mutation(() => String, { name: "image" })
  @UseGuards(TwoFactorGuard)
  async uploadFile(
    @User("id") userId: string,
    @Args({ name: "file", type: () => UploadScalar })
    file: FileUpload,
  ) {
    const { createReadStream, filename, mimetype } = file;

    const stream = createReadStream();

    let fileBuffer: Buffer<ArrayBufferLike>;

    try {
      fileBuffer = await buffer(stream);
    } catch (error) {
      Logger.error("Error reading file stream", error);
    }

    if (!mimetype.startsWith("image")) {
      throw new BadRequestException(
        "The file you uploaded doesn't seem to be an image, please upload a file that ends in .jp(e)g or .png.",
      );
    }

    return this.storageService.uploadObject(userId, "pictures", fileBuffer, filename);
  }
}
