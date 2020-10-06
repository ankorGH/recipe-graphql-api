import {
  Resolver,
  Query,
  UseMiddleware,
  Arg,
  Ctx,
  Mutation,
  PubSub,
  Publisher,
  Subscription,
  Root,
} from "type-graphql";

import { User } from "../auth/user.entity";
import { Recipe } from "./recipe.entity";
import { Comment } from "./comment.entity";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { SubscriptionTopics } from "../utils/types";
import { CreateCommentInput, UpdateCommentInput } from "./comment.input";

@Resolver(Comment)
export class CommentResolver {
  @Query(() => Comment, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async comment(
    @Arg("id") id: number,
    @Ctx("user") user: User
  ): Promise<Comment | null> {
    const comment = await this.getComment(id, user);
    if (!comment) {
      return null;
    }

    return comment;
  }

  @Query(() => [Comment])
  @UseMiddleware(AuthMiddleware)
  async comments(@Ctx("user") user: User): Promise<Comment[]> {
    return await Comment.find({
      relations: ["user"],
      where: {
        user,
      },
    });
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async createComment(
    @Ctx("user") user: User,
    @Arg("data") commentDetails: CreateCommentInput,
    @PubSub(SubscriptionTopics.CreateComment) publish: Publisher<Comment>
  ): Promise<Comment | null> {
    const { message, recipeId } = commentDetails;

    const recipe = await Recipe.findOne(recipeId, {
      where: {
        user,
      },
    });

    if (!recipe) {
      return null;
    }

    const comment = new Comment();
    comment.user = user;
    comment.message = message;
    comment.recipe = recipe;
    await comment.save();

    await publish(comment);

    return comment;
  }

  @Mutation(() => Comment, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async updateComment(
    @Arg("id") id: number,
    @Arg("data") commentDetails: UpdateCommentInput,
    @Ctx("user") user: User
  ): Promise<Comment | null> {
    const comment = await this.getComment(id, user);
    if (!comment) {
      return null;
    }

    comment.message = commentDetails.message;

    return await comment.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteComment(
    @Ctx("user") user: User,
    @Arg("id") id: number
  ): Promise<boolean> {
    const comment = await this.getComment(id, user);
    if (!comment) {
      return false;
    }

    await comment.remove();

    return true;
  }

  @Subscription({
    topics: SubscriptionTopics.CreateComment,
  })
  @UseMiddleware(AuthMiddleware)
  newNotification(@Root() comment: Comment): Comment {
    return comment;
  }

  private async getComment(
    id: number,
    user: User
  ): Promise<Comment | undefined> {
    return await Comment.findOne(id, {
      relations: ["user"],
      where: {
        user,
      },
    });
  }
}
