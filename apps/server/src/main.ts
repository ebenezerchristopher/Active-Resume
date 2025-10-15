import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Config } from "./config/schema";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { graphqlUploadExpress } from "graphql-upload-ts";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === "development" ? ["debug"] : ["error", "warn", "log"],
  });

  const configService = app.get(ConfigService<Config>);

  const publicUrl = configService.getOrThrow("PUBLIC_URL");
  const isHTTPS = publicUrl.startsWith("https://") ?? false;

  // GraphQL File Upload Parser Middleware
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  // Cookie Parser
  app.use(cookieParser());

  // CORS
  app.enableCors({ credentials: true, origin: !isHTTPS });

  // Helmet - enabled only in production
  if (isHTTPS) app.use(helmet({ contentSecurityPolicy: false }));

  const globalPrefix = "/api";
  app.setGlobalPrefix(globalPrefix);

  // Swagger (OpenAPI Docs)
  // This can be accessed by visiting {SERVER_URL}/api/docs
  const config = new DocumentBuilder()
    .setTitle("Reactive Resume")
    .setDescription(
      "Reactive Resume is a free and open source resume builder that's built to make the mundane tasks of creating, updating and sharing your resume as easy as 1, 2, 3.",
    )
    .addCookieAuth("Authentication", { type: "http", in: "cookie", scheme: "Bearer" })
    .setVersion("4.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
