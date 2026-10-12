import {z} from "zod";

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
    username: z.string().min(3,'username must be at least 3 char').max(63,'username must be less that 63 char')
        .regex(
            /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
            "username can contain lowercase letters, number, hyphens."
        )
        .refine(
            (val) => !val.includes('--'),
            'username cannot contain consecutive hyphens.'
        )
        .transform((val) => val.toLocaleLowerCase())
})

export const loginSchema =  z.object({
    email: z.string().email(),
    password: z.string().min(1),

})