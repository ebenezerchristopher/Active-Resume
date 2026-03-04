import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class PrintResumeOutput {
  @Field()
  url: string;
}
