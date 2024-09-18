import { Hono } from "hono";

import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign, verify } from "hono/jwt";

export const userRouter = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }>();


async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };
  
  
  
  userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
  
    try {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });
  
      if (existingUser) {
        return c.json({ error: "Email already exists" }, 400);
      }
  
      const hashedPassword = await hashPassword(body.password);
  
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          name: body.name,
        },
      });
  
      const token = await sign({ userId: user.id }, c.env.JWT_SECRET);
  
      return c.json({
        jwt: token,
      });
    } catch (e) {
      console.error(e);
      return c.json({ error: "Forbidden" }, 403);
    }
  });
  
  userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
  
    if (!user || !((await hashPassword(body.password)) === user.password)) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
  
    const token = await sign({ userId: user.id }, c.env.JWT_SECRET);
  
    return c.json({
      jwt: token,
    });
  });