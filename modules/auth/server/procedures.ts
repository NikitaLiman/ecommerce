import {headers as getHeader,cookies as getCookies} from 'next/headers'

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {TRPCError} from "@trpc/server";
import {AUTH_COOKIE} from "@/modules/auth/constants";
import {loginSchema, registerSchema} from "@/modules/auth/schemas";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ctx}) => {
        const headers = await getHeader()


        const session = await ctx.db.auth({headers})


        return session;
    }),

    logout: baseProcedure.mutation(async () => {
        const cookies = await getCookies();
        cookies.delete(AUTH_COOKIE);
    }),

    register: baseProcedure
        .input(
            registerSchema
        )
        .mutation(async ({input,ctx}) => {
            const existingData = await ctx.db.find({
                collection: "users",
                limit: 1,
                where: {
                    username: {
                        equals: input.username,
                    }
                }
            })

            const existingUser = existingData.docs[0]

            if(existingUser) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `User already exists`,
                })
            }

            const tenant = await ctx.db.create({
                collection: "tenants",
                data: {
                    name: input.username,
                    slug: input.username,
                    stripeAccountId: "mock",
                }
            })

            await ctx.db.create({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                    username: input.username,
                    tenants: [
                        {
                            tenant: tenant.id,
                        }
                    ]
                },
            })
            const data = await ctx.db.login({
                collection: "users",
                data: {
                    email: input.email,
                    password: input.password,
                }
            })
            if(!data.token) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Failed to login",
                })
            }
            const cookies = await getCookies();
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: '/',
                // sameSite: "none",
                // domain: ""
            })
        }),
    login: baseProcedure
        .input(
            loginSchema
        )
        .mutation(async ({input,ctx}) => {
           const data = await ctx.db.login({
               collection: "users",
               data: {
                   email: input.email,
                   password: input.password,
               }
           })
            if(!data.token) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Failed to login",
                })
            }
            const cookies = await getCookies();
            cookies.set({
                name: AUTH_COOKIE,
                value: data.token,
                httpOnly: true,
                path: '/',
                // sameSite: "none",
                // domain: ""
            })
            return data
        })
})