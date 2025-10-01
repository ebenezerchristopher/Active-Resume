import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";
import { TranslationModule } from "./translation/translation.module";
import { ContributorsModule } from "./contributors/contributors.module";
import { FeatureModule } from "./feature/feature.module";
import { MailModule } from "./mail/mail.module";
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "apps/server/schema.gql"), // Path to where the schema will be generated
      sortSchema: true, // Sorts the schema alphabetically
      playground: true, // Enables the GraphQL Playground (like Postman for GraphQL)
      // For production, you might want to set playground: false
      // This is crucial for accessing cookies and setting them on the response
      context: ({ req, res }) => ({ req, res }),
      path: "/api/graphql",
    }),

    //core modules
    MailModule,

    UserModule,
    AuthModule.register(),
    ConfigModule,
    DatabaseModule,
    TranslationModule,
    ContributorsModule,
    FeatureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
