import { z } from 'zod';

export const usernameValidation = z
    .string()
    .trim()
    .min(2,"Username must be atleast 2 characters")
    .max(20,'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/,"Username must only contain letters, numbers and underscores")


export const signUpSchema = z.object({
    username: usernameValidation,

    email:z
    .email({
        error:"Invalid email address"
    }),
    password:z
    .string()
    .min(8,{
        message:"Password should be atleast 8 characters long"
    })
})

