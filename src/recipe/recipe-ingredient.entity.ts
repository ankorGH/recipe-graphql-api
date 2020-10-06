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

import { Recipe } from "./recipe.entity";

@ObjectType()
@Entity()
export class RecipeIngredient extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Recipe, (recipe) => recipe.ingredients, {
    nullable: false,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "recipe_id" })
  recipe!: Recipe;
}
