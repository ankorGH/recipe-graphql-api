import { InputType, Field } from "type-graphql";

@InputType()
export class CreateCommentInput {
  @Field()
  message!: string;

  @Field()
  recipeId!: number;
}

@InputType()
export class UpdateCommentInput {
  @Field()
  message!: string;
}
