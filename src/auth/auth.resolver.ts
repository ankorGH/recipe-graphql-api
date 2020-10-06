import jwt from "jsonwebtoken";
import { compareSync } from "bcryptjs";
import {
  Resolver,
  Mutation,
  Arg,
  UseMiddleware,
  Ctx,
  Query,
} from "type-graphql";
import cookie from "cookie";

import { User } from "./user.entity";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { RegisterInput, LoginInput } from "./auth.input";
import { AuthContext } from "src/utils/context.interface";

@Resolver(User)
export class AuthResolver {
  @Mutation(() => String)
  async register(@Arg("data") userDetails: RegisterInput): Promise<string> {
    const { contact, email, fullName, password } = userDetails;
    try {
      let user = new User();
      user.fullName = fullName;
      user.contact = contact;
      user.password = password;
      user.email = email;

      user = await user.save();

      return generateToken(fullName, email, contact);
    } catch (err) {
      // handle err for unique contact/email
      console.log(err);
      return "";
    }
  }

  @Mutation(() => String)
  async login(
    @Arg("data") userDetails: LoginInput,
    @Ctx() ctx: AuthContext
  ): Promise<string | null> {
    const { email, password } = userDetails;

    const user = await User.createQueryBuilder("user")
      .select()
      .addSelect("user.password")
      .where("email = :email", { email })
      .getOne();

    if (!user || !compareSync(password, user.password)) {
      // originally we are supposed to a generic error message
      // Not sure yet
      return "";
    }

    const token = generateToken(user.fullName, email, user.contact);

    const { res } = ctx;

    // setting cookie
    // browser based client should use cookies
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("tkn", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        secure: false,
        // domain: "http://localhost:9000/graphql",
      })
    );

    return token;
  }

  @UseMiddleware(AuthMiddleware)
  @Query(() => User)
  async getProfile(@Ctx("user") user: User): Promise<User> {
    return user;
  }

  @UseMiddleware(AuthMiddleware)
  @Query(() => String)
  async logout(@Ctx() ctx: AuthContext): Promise<string> {
    const { res } = ctx;

    res.clearCookie("tkn");
    return "";
  }
}

function generateToken(
  fullName: string,
  email: string,
  contact: string
): string {
  return jwt.sign(
    {
      fullName,
      email,
      contact,
    },
    "@pas@pas@pas@pas@",
    {
      algorithm: "HS256",
      expiresIn: "8d",
    }
  );
}
