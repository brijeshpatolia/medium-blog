import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import bcrypt from "bcryptjs";
import { signupInput, signinInput } from "medium-common-brijeshp";

// Define userRouter with environment bindings for the database URL and JWT secret
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// Helper function to hash a password using bcrypt
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10); // 10 salt rounds
}

// Helper function to verify a password against a hash
async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Signup route with input validation and user creation
userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  // Validate the input using the signupInput schema
  const parseResult = signupInput.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      { error: "Invalid input", details: parseResult.error.errors },
      400
    );
  }

  const data = parseResult.data;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return c.json({ error: "Email already exists" }, 400);
    }

    // Hash the password before storing it
    const hashedPassword = await hashPassword(data.password);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name ?? "", // Provide a default value for name
      },
    });

    // Sign a JWT with the user's ID
    const token = await sign(
      { userId: user.id, name: user.name },
      c.env.JWT_SECRET
    );

    // Return the JWT as a response
    return c.json({ jwt: token });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Server error" }, 500);
  }
});

// Signin route with input validation and authentication
userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  // Validate the input using the signinInput schema
  const parseResult = signinInput.safeParse(body);
  if (!parseResult.success) {
    return c.json(
      { error: "Invalid input", details: parseResult.error.errors },
      400
    );
  }

  const data = parseResult.data;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // If user does not exist or password is incorrect, return 401 Unauthorized
    if (!user || !(await verifyPassword(data.password, user.password))) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Sign a JWT with the user's ID
    const token = await sign(
      {
        userId: user.id,
        name: user.name, // Include the user's name in the JWT payload for future use
      },
      c.env.JWT_SECRET
    );

    // Return the JWT as a response
    return c.json({ jwt: token });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Server error" }, 500);
  }
});

export default userRouter;
