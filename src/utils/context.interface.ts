import { Response } from "express";

import { User } from "../auth/user.entity";
import { Request } from "./types";

export interface AuthContext {
  req: Request;
  res: Response;
  user?: User;
}
