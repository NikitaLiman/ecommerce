

import {baseProcedure, createTRPCRouter} from "@/trpc/init";
import {z} from "zod";
import {Sort, Where} from "payload";
import {Category, Media, Tenant} from "@/payload-types";
import {headers as getHeaders} from "next/headers";
import {sortValues} from "@/modules/products/search-params";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {TRPCError} from "@trpc/server";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure.input(
        z.object({
            id: z.string(),
        })
    ).query(async ({ctx,input}) => {

        const headers = await getHeaders();
        const session = await ctx.db.auth({headers})

        const product = await ctx.db.findByID({
            collection: "products",
            id: input.id,
            depth: 2,
        })


        if(product.isArchived) {
            throw new TRPCError(
                {
                    code: 'NOT_FOUND',
                    message: `Product not found.`,
                }
            )
        }

        let isPurchased = false;

        console.log("Текущий пользователь:", session.user?.id);
        console.log("Товар:", input.id);

        if (session.user) {
            const ordersData = await ctx.db.find({
                collection: "orders",
                limit: 1,
                where: {
                    and: [
                        {
                            products: {
                                equals: input.id,
                            },
                        },
                        {
                            user: {
                                equals: session.user.id,
                            },
                        },
                    ],
                },
            });

            console.log("Найденные заказы:", ordersData.docs);

            isPurchased = ordersData.docs.length > 0;
        }

        console.log("isPurchased:", isPurchased);


        const reviews = await ctx.db.find({
            collection: "reviews",
            pagination: false,
            where: {
                products: {
                    equals: input.id,
                }
            },
        })

        const reviewRating =
            reviews.docs.length > 0
            ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.totalDocs
            : 0;

        const ratingDistribution: Record<number, number> = {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
        }

        if(reviews.totalDocs > 0) {
            reviews.docs.forEach((review) => {
                const rating = review.rating;

                if(rating >= 1 && rating <=  5) {
                    ratingDistribution[rating] =(ratingDistribution[rating] || 0) + 1
                }
            })
            Object.keys(ratingDistribution).forEach((key) => {
                const rating = Number(key);
                const count = ratingDistribution[rating] || 0;
                ratingDistribution[rating] = Math.round(
                    (count / reviews.totalDocs) * 100
                )
            })
        }

        return {
            ...product,
            isPurchased,
            image: product.image as Media | null,
            tenant: product.tenant as Tenant & {image: Media | null},
            reviewCount: reviews.totalDocs,
            ratingDistribution,
            reviewRating,
        }
    }),
    getMany: baseProcedure.input(
        z.object({
            search: z.string().nullable().optional(),
            cursor: z.number().default(1),
            limit: z.number().default(DEFAULT_LIMIT),
            category: z.string().optional().nullable(),
            minPrice: z.string().optional().nullable(),
            maxPrice: z.string().optional().nullable(),
            tags: z.array(z.string()).optional().nullable(),
            sort: z.enum(sortValues).optional().nullable(),
            tenantSlug: z.string().optional().nullable(),
    }))
        .query(async ({ctx,input}) => {

            const where: Where = {
                isArchived: {
                    not_equals: true,
                }
            }

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

            if(input.tenantSlug) {
                where["tenant.slug"] = {
                    equals: input.tenantSlug
                };
            } else {
                where['isPrivate'] = {
                    not_equals: true
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

        if(input.search) {
            where['name'] = {
                like: input.search,
            }
        }

        const data = await ctx.db.find({
            collection: 'products',
            depth: 2,
            where,
            sort,
            page: input.cursor,
            limit: input.limit,
        })

        const dataWithSummarizedReviews = await Promise.all(
            data.docs.map(async (doc) => {
                const reviewsData = await ctx.db.find({
                    collection: 'reviews',
                    pagination: false,
                    where: {
                        products: {
                            equals: doc.id
                        }
                    }
                });
                return {
                    ...doc,
                    reviewCount: reviewsData.totalDocs,
                    reviewRating:
                        reviewsData.docs.length === 0
                        ? 0
                        : reviewsData.docs.reduce((acc, review) => acc + review.rating, 0) / reviewsData.totalDocs,
                }
            })
        )

        return {
            ...data,
            docs: dataWithSummarizedReviews.map(doc => ({
                ...doc,
                image: doc.image as Media,
                tenant: doc.tenant as Tenant & {image: Media | null}
            }))
        }
    })
})