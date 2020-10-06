import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { hashSync } from "bcryptjs";
import { ObjectType, Field, ID } from "type-graphql";

import { Recipe } from "../recipe/recipe.entity";
import { Comment } from "../recipe/comment.entity";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Field()
  @Column()
  fullName!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ unique: true })
  contact!: string;

  @Column({ select: false })
  password!: string;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field(() => [Recipe])
  @OneToMany(() => Recipe, (recipe) => recipe.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  recipes!: Recipe[];

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.user, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  comments!: Comment[];

  @BeforeInsert()
  hashPassword() {
    const hashedPassword = hashSync(this.password, 12);
    this.password = hashedPassword;
  }
}
