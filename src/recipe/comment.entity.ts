import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "../auth/user.entity";
import { Recipe } from "./recipe.entity";

@Entity()
@ObjectType()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Field()
  @Column()
  message!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => Recipe)
  @ManyToOne(() => Recipe, (recipe) => recipe.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "recipe_id" })
  recipe!: Recipe;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;
}
