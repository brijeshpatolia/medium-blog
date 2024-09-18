import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

import { verify } from 'hono/jwt';

// In your middleware
bookRouter.use(async (c, next) => {
  const jwt = c.req.header('Authorization');
  if (!jwt) {
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }

  const token = jwt.split(' ')[1];
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    if (!payload || !payload.userId) {
      c.status(401);
      return c.json({ error: "Unauthorized" });
    }
    //@ts-ignore
    c.set('userId', payload.userId);
    await next();
  } catch (error) {
    console.error('Token verification error:', error);
    c.status(401);
    return c.json({ error: "Unauthorized" });
  }
});

  

bookRouter.post('/', async (c) => {
    const userId = c.get('userId');
    if (!userId) {
      c.status(400);
      return c.json({ error: "User ID is missing" });
    }
  
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body = await c.req.json();
    try {
      const post = await prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
          author: {
            connect: { id: userId }
          }
        }
      });
      return c.json({
        id: post.id
      });
    } catch (error) {
      console.error('Error creating post:', error);
      c.status(500);
      return c.json({ error: "Internal Server Error" });
    }
  });
  

bookRouter.put('/', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});

bookRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		}
	});

	return c.json(post);
})