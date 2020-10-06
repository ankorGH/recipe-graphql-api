import { InputType, Field } from "type-graphql";
import { IsEmail, MinLength } from "class-validator";

import { User } from "./user.entity";

@InputType()
export class RegisterInput implements Partial<User> {
  @Field()
  @MinLength(2)
  fullName!: string;

  @Field()
  @MinLength(8)
  password!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(10)
  contact!: string;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}
