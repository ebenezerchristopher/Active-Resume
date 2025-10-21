import { ObjectType, Field } from "@nestjs/graphql";
import { GraphQLJSON } from "graphql-scalars";
import { Resume } from "@prisma/client";

@ObjectType()
export class ResumeEntity implements Resume {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  title: string;

  @Field()
  slug: string;

  @Field(() => GraphQLJSON)
  data: object;

  @Field()
  locked: boolean;

  @Field()
  visibility: "private" | "public";

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
