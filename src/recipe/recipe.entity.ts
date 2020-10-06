import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "../auth/user.entity";
import { Comment } from "./comment.entity";
import { RecipeIngredient } from "./recipe-ingredient.entity";

@Entity()
@ObjectType()
export class Recipe extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => [RecipeIngredient]!)
  @OneToMany(
    () => RecipeIngredient,
    (recipeIngredient) => recipeIngredient.recipe,
    {
      nullable: false,
    }
  )
  ingredients!: RecipeIngredient[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.recipes, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.recipe, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  comments!: Comment[];
}
