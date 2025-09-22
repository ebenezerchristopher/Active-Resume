import { ContributorDto } from "@active-resume/dto";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class ContributorEntity implements ContributorDto {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  avatar: string;
}
