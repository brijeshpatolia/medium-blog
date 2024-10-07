import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { createPostInput, updatePostInput } from "medium-common-brijeshp";
import { verify } from "hono/jwt";

// Define bookRouter with environment bindings for database and JWT secret, and a variable for userId
export const bookRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Middleware for JWT verification and setting userId
bookRouter.use(async (c, next) => {
  const jwt = c.req.header("Authorization");
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const token = jwt.split(" ")[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || !payload.userId) {
      c.status(401);
      return c.json({ error: "Unauthorized" });
    }
    //@ts-ignore
    c.set("userId", payload.userId);
    await next();
  } catch (error) {
    console.error("Token verification error:", error);
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }
});

// POST /: Create a new post
bookRouter.post("/", async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    c.status(400);
    return c.json({ error: "User ID is missing" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  // Validate input using createPostInput schema
  const validation = createPostInput.safeParse(body);
  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.errors },
      400
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title: validation.data.title,
        content: validation.data.content, // Rich text content (HTML/Markdown)
        author: {
          connect: { id: userId },
        },
      },
    });

    return c.json({ message: "Post created successfully", id: post.id });
  } catch (error) {
    console.error("Error creating post:", error);
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

// PUT /: Update an existing post
bookRouter.put("/", async (c) => {
  const userId = c.get("userId");
  if (!userId) {
    c.status(400);
    return c.json({ error: "User ID is missing" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  // Validate input using updatePostInput schema
  const validation = updatePostInput.safeParse(body);
  if (!validation.success) {
    return c.json(
      { error: "Invalid input", details: validation.error.errors },
      400
    );
  }

  try {
    const post = await prisma.post.update({
      where: {
        id: validation.data.id,
        authorId: userId,
      },
      data: {
        title: validation.data.title,
        content: validation.data.content,
      },
    });

    return c.text("Updated post");
  } catch (error) {
    console.error("Error updating post:", error);
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

// GET /bulk: Retrieve all posts
bookRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true, // Select the createdAt field
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json({ posts });
  } catch (error) {
    console.error("Error retrieving posts:", error);
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

// GET /:id: Retrieve a post by ID
// GET /:id: Retrieve a post by ID
bookRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    c.status(400);
    return c.json({ error: "Post ID is missing" });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { // Include author information
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      c.status(404);
      return c.json({ error: "Post not found" });
    }

    return c.json(post);
  } catch (error) {
    console.error("Error retrieving post:", error);
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});


export default bookRouter;
