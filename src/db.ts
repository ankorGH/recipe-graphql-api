import { createConnection } from "typeorm";

export const connectDB = async () => {
  await createConnection();
  console.log("Connected to DB");
};
