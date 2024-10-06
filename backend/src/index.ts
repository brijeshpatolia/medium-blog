import { Hono } from "hono";
import { userRouter } from "./routes/user";
import {  bookRouter } from "./routes/blog";

import { cors } from "hono/cors";
// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();
app.use("/*", cors());

app.route("/api/v1/user",userRouter);
app.route("/api/v1/blog", bookRouter);
// Utility function to hash the password using SHA-256




export default app;
