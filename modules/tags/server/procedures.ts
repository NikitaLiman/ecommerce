

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";

export const tagsRouter = createTRPCRouter({
    getMany: baseProcedure.input(
        z.object({
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT    ),
            maxPrice: z.string().optional().nullable(),
    }))
        .query(async ({ctx,input}) => {


        const data = await ctx.db .find({
            collection: 'tags',
            page: input.cursor,
            limit: input.limit,
        })


        return data
    })
})