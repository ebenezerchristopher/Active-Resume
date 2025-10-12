import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type {} from "multer";
import { MinioModule } from "nestjs-minio-client";

import { Config } from "../config/schema";
import { StorageResolver } from "./storage.resolver";
import { StorageService } from "./storage.service";
import { UploadScalar } from "./entities/storage.entity";

@Module({
  imports: [
    MinioModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => ({
        endPoint: configService.getOrThrow<string>("STORAGE_ENDPOINT"),
        port: configService.getOrThrow<number>("STORAGE_PORT"),
        region: configService.get<string>("STORAGE_REGION"),
        accessKey: configService.getOrThrow<string>("STORAGE_ACCESS_KEY"),
        secretKey: configService.getOrThrow<string>("STORAGE_SECRET_KEY"),
        useSSL: configService.getOrThrow<boolean>("STORAGE_USE_SSL"),
      }),
    }),
  ],

  providers: [StorageService, StorageResolver, UploadScalar],
  exports: [StorageService],
})
export class StorageModule {}
