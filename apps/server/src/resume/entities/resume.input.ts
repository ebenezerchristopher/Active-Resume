import { Field, InputType } from "@nestjs/graphql";
import { CreateResumeDto, ImportResumeDto } from "@active-resume/dto";

import { GraphQLJSON } from "graphql-scalars";

@InputType()
export class CreateResumeInput implements CreateResumeDto {
  @Field()
  title: string;

  @Field()
  slug: string;

  @Field()
  visibility: "private" | "public";
}

@InputType()
export class UpdateResumeInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  userId?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  slug?: string;

  @Field(() => GraphQLJSON, { nullable: true })
  data?: object;

  @Field({ nullable: true })
  locked?: boolean;

  @Field({ nullable: true })
  visibility?: "private" | "public";

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}

@InputType()
export class ImportResumeInput implements ImportResumeDto {
  @Field()
  title: string;
  @Field()
  slug: string;
  @Field({ nullable: true })
  visibility?: "private" | "public";
  @Field(() => GraphQLJSON)
  data: object;
}
