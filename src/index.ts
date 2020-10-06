import "reflect-metadata";
import cors from "cors";
import expressJwt from "express-jwt";
import { buildSchema } from "type-graphql";
import { createServer } from "http";
import { ApolloServer } from "apollo-server-express";
import express, { Response } from "express";
import cookie from "cookie";

import { Request } from "./utils/types";
import { connectDB } from "./db";
import { AuthContext } from "./utils/context.interface";
import { AuthResolver } from "./auth/auth.resolver";
import { RecipeResolver } from "./recipe/recipe.resolver";
import { CommentResolver } from "./recipe/comment.resolver";

const startServer = async () => {
  const app = express();

  await connectDB();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:9000",
    })
  );

  app.use(
    expressJwt({
      algorithms: ["HS256"],
      secret: "@pas@pas@pas@pas@",
      credentialsRequired: false,
      getToken: (req) => {
        if (req.headers.cookie) {
          return cookie.parse(req.headers.cookie)["tkn"];
        } else if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[0] === "Bearer"
        ) {
          return req.headers.authorization.split(" ")[1];
        }

        return null;
      },
    })
  );

  const schema = await buildSchema({
    resolvers: [RecipeResolver, AuthResolver, CommentResolver],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: { req: Request; res: Response }): AuthContext => ({
      req,
      res,
    }),
    playground: true,
    subscriptions: "/subscriptions",
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const server = createServer(app);
  apolloServer.installSubscriptionHandlers(server);

  server.listen(9000, () => {
    console.log(
      `Server is listening on: http://localhost:9000${apolloServer.graphqlPath}`
    );
    console.log(
      `Server is listening on ws://localhost:9000${apolloServer.subscriptionsPath}`
    );
  });
};

startServer();
