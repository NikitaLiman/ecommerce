

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {Sort, Where} from "payload";
import {Category} from "@/payload-types";
import {equal} from "node:assert";
import {sortValues} from "@/modules/products/search-params";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.input(
        z.object({
            category: z.string().optional().nullable(),
            minPrice: z.string().optional().nullable(),
            maxPrice: z.string().optional().nullable(),
            tags: z.array(z.string()).optional().nullable(),
            sort: z.enum(sortValues).optional().nullable(),
    }))
        .query(async ({ctx,input}) => {

            const where: Where = {}

            let sort: Sort = '-createdAt';

            if(input.sort === 'curated') {
                sort = '-createdAt';
            }
            if(input.sort === 'trending') {
                sort = '-createdAt';
            }
            if(input.sort === 'hot_and_new') {
                sort = '-createdAt';
            }

            if (input.minPrice && input.maxPrice) {
                where.price = {
                    greater_than_equal: input.minPrice,
                    less_than_equal: input.maxPrice,
                }
            } else if (input.minPrice) {
                where.price = {
                    greater_than_equal: input.minPrice
                }
            } else if (input.maxPrice) {
                where.price = {
                    less_than_equal: input.maxPrice
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
                    subCategorySlugs.push(
                        ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
                    );
                    where['category.slug'] = {
                        in: [parentCategory.slug,...subCategorySlugs],
                    }
                }

        }

        if(input.tags && input.tags.length > 0) {
            where['tags.name'] = {
                in: input.tags,
            }
        }

        const data = await ctx.db .find({
            collection: 'products',
            depth: 1,
            where,
            sort
        })


        return data
    })
})