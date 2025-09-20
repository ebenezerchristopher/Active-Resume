import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class LanguageEntity {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  locale: string;

  @Field()
  editorCode: string;

  @Field(() => Number, { nullable: true })
  progress?: number;
}
