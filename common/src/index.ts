import z from "zod";

export const signupInput = z.object(
    {
        email : z.string().email(),
        password : z.string().min(3),
        name: z.string().optional()
    }
) 


export type signupInput = z.infer<typeof signupInput>

export const signinInput  = z.object(
    {
        email : z.string().email(),
        password : z.string().min(3)
    }
)

export type signinInput = z.infer<typeof signinInput>


export const createPostInput = z.object(
    {
        title : z.string().min(3),
        content : z.string(),
    }
)

export type createPostInput = z.infer<typeof createPostInput>


export const updatePostInput = z.object({

     title: z.string().min(3),
     content : z.string(),
     id : z.string()
})

export type updatePostInput = z.infer<typeof updatePostInput>