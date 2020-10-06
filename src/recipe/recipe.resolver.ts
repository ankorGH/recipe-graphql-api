import {
  Resolver,
  Query,
  Arg,
  Mutation,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { getConnection } from "typeorm";

import { User } from "../auth/user.entity";
import { Recipe } from "./recipe.entity";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RecipeIngredient } from "./recipe-ingredient.entity";
import { AddRecipeInput, UpdateRecipeInput } from "./recipe.input";

@Resolver(Recipe)
export class RecipeResolver {
  @Query(() => [Recipe]!)
  @UseMiddleware(AuthMiddleware)
  async recipes(@Ctx("user") user: User): Promise<Recipe[]> {
    return await Recipe.find({
      relations: ["ingredients", "user", "comments"],
      where: {
        user,
      },
    });
  }

  @Query(() => Recipe, { nullable: true })
  @UseMiddleware(AuthMiddleware)
  async recipe(
    @Arg("id") id: number,
    @Ctx("user") user: User
  ): Promise<Recipe | null> {
    const recipe = await this.getRecipe(id, user);

    if (!recipe) {
      return null;
    }

    return recipe;
  }

  @Mutation(() => Recipe)
  @UseMiddleware(AuthMiddleware)
  async createRecipe(
    @Arg("data") recipeDetails: AddRecipeInput,
    @Ctx("user") user: User
  ): Promise<Recipe> {
    const { title, description, ingredients } = recipeDetails;

    // @ts-ignore
    return await getConnection().transaction(async (entityManager) => {
      let recipe = new Recipe();
      recipe.user = user;
      recipe.title = title;
      recipe.description = description;

      recipe = await recipe.save();
      console.log(recipe);

      let recipeIngredients: RecipeIngredient[] = [];

      for (let name of ingredients) {
        let ingredient = new RecipeIngredient();
        ingredient.name = name;
        ingredient.recipe = recipe;

        ingredient = await ingredient.save();
        recipeIngredients.push(ingredient);
      }

      recipe.ingredients = recipeIngredients;
      return recipe;
    });
  }

  @Mutation(() => Recipe)
  @UseMiddleware(AuthMiddleware)
  async updateRecipe(
    @Arg("id") id: number,
    @Arg("data") recipeDetail: UpdateRecipeInput,
    @Ctx("user") user: User
  ): Promise<Recipe | null> {
    const recipe = await this.getRecipe(id, user);

    if (!recipe) {
      return null;
    }

    const { title, description } = recipeDetail;
    recipe.title = title ?? recipe.title;
    recipe.description = description ?? recipe.description;

    return await recipe.save();
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deleteRecipe(
    @Arg("id") id: number,
    @Ctx("user") user: User
  ): Promise<boolean> {
    const recipe = await this.getRecipe(id, user);
    if (!recipe) {
      return false;
    }

    await recipe.remove();

    return true;
  }

  private async getRecipe(id: number, user: User): Promise<Recipe | undefined> {
    return await Recipe.findOne(id, {
      relations: ["ingredients", "user", "comments"],
      where: {
        user,
      },
    });
  }
}
