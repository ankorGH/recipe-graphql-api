import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
  user?: {
    fullName: string;
    email: string;
    contact: string;
    iat: number;
    exp: number;
  };
}

export enum SubscriptionTopics {
  CreateComment = "CREATE_COMMENT",
}
