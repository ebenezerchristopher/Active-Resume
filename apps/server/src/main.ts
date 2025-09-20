/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Config } from "./config/schema";
import cookieParser from "cookie-parser";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === "development" ? ["debug"] : ["error", "warn", "log"],
  });

  const configService = app.get(ConfigService<Config>);

  const publicUrl = configService.getOrThrow("PUBLIC_URL");
  const isHTTPS = publicUrl.startsWith("https://") ?? false;

  // Cookie Parser
  app.use(cookieParser());

  // CORS
  app.enableCors({ credentials: true, origin: !isHTTPS });

  // Helmet - enabled only in production
  if (isHTTPS) app.use(helmet({ contentSecurityPolicy: false }));

  /*
  const globalPrefix = "/api";
  app.setGlobalPrefix(globalPrefix);
  */
  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
