import { InputType, Field } from "type-graphql";
import { IsNotEmpty, IsArray } from "class-validator";

@InputType()
export class AddRecipeInput {
  @Field(() => String!)
  @IsNotEmpty()
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String]!)
  @IsNotEmpty()
  @IsArray()
  ingredients!: string[];
}

@InputType()
export class UpdateRecipeInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
