

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {Where} from "payload";
import {Category} from "@/payload-types";
import {equal} from "node:assert";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.input(
        z.object({
        category: z.string().optional().nullable(),
            minPrice: z.string().optional().nullable(),
            maxPrice: z.string().optional().nullable(),
    }))
        .query(async ({ctx,input}) => {

            const where: Where = {}

            if(input.minPrice) {
                where.minPrice = {
                    greater_than_equal: input.minPrice,
                }
            }
            if(input.minPrice) {
                    where.maxPrice = {
                        greater_than_equal: input.maxPrice,
                }
            }

            if(input.category) {
                const categoriesData = await ctx.db.find({
                    collection: "categories",
                    limit: 1,
                    depth: 1,
                    pagination: false,
                    where: {
                        slug: {
                            equals: input.category,
                        }
                    }
            })

            const formattedData = categoriesData.docs.map(doc => ({
                ...doc,
                subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
                    ...(doc as Category)
                }))
            }))
            const subCategorySlugs = []
            const parentCategory = formattedData[0]

                if(parentCategory) {
                    subCategorySlugs.push({
                        ...parentCategory.subcategories.map((subcategory) => subcategory.slug),
                    })
                    where['category.slug'] = {
                        in: [parentCategory.slug,...subCategorySlugs],
                    }
                }

        }
        const data = await ctx.db .find({
            collection: 'products',
            depth: 1,
            where: {

            }
        })


        return data
    })
})