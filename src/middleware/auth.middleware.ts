import { MiddlewareFn } from "type-graphql";

import { User } from "../auth/user.entity";
import { AuthContext } from "../utils/context.interface";

export const AuthMiddleware: MiddlewareFn<AuthContext> = async (
  { context },
  next
) => {
  if (!context.req.user) {
    throw new Error("not authenticated");
  }

  const { email } = context.req.user;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("not authenticated");
  }

  // we can check access permissions here

  context.user = user;

  return next();
};
