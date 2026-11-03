
import {baseProcedure, createTRPCRouter, protectedProcedure} from "@/trpc/init";
import {z} from "zod";
import {Media, Tenant} from "@/payload-types";
import {TRPCError} from "@trpc/server";
import   Stripe from "stripe";
import {CheckoutMetadata, ProductMetadata} from "@/modules/checkout/types";
import {stripe} from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
    verify: protectedProcedure.mutation(async ({ctx}) => {
        const user = await ctx.db.findByID({
            collection: 'users',
            id: ctx.session.user.id,
            depth: 0,
        })

        if(!user) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            })
        }

        const tenantId = user.tenants?.[0]?.tenant as string;


        const tenant = await ctx.db.findByID({
            collection: "tenants",
            id: tenantId
        })

        if(!tenant) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Tenant not found",
            })
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL

        if (!appUrl) {
            throw new Error("NEXT_PUBLIC_APP_URL is not set")
        }

        // Reconcile with Stripe even if an onboarding webhook was missed.
        const account = await stripe.accounts.retrieve(tenant.stripeAccountId)
        await ctx.db.update({
            collection: "tenants",
            id: tenant.id,
            overrideAccess: true,
            data: { stripeDetailsSubmitted: account.details_submitted },
        })

        if (account.details_submitted) {
            return { url: `${appUrl}/admin` }
        }

        const accountLink = await stripe.v2.core.accountLinks.create({
            account: tenant.stripeAccountId,
            use_case: {
                type: "account_onboarding",
                account_onboarding: {
                    refresh_url: `${appUrl}/admin`,
                    return_url: `${appUrl}/admin`,
                },
            },
        })



        return { url: accountLink.url }
    }),

    purshace: protectedProcedure.input(
        z.object({
            productsIds: z.array(z.string()).min(1),
            tenantSlug: z.string().min(1)
        })
    ).mutation(async ({ctx, input}) => {
        const products = await ctx.db.find({
            collection: "products",
            depth: 2,
            where: {
                and: [
                    {
                        id: {
                            in: input.productsIds,
                        }
                    },
                    {
                        "tenant.slug": {
                            equals: input.tenantSlug
                        }
                    }
                ]
            }
        })
        if(products.totalDocs !== input.productsIds.length) {
            throw new TRPCError({code: 'NOT_FOUND', message: 'Product not found.'})
        }
        const tenantsData = await ctx.db.find({
            collection: "tenants",
            limit: 1,
            pagination: false,
            where: {
                slug: {
                    equals: input.tenantSlug,
                }
            }
        })
        const tenant = tenantsData.docs[0]

        if(!tenant) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Tenant not found.',
            })
        }

        if(!tenant.stripeDetailsSubmitted) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Tenant not allowed to sell products.',
            })
        }

        const lineItem: Stripe.Checkout.SessionCreateParams.LineItem[] =
            products.docs.map((product) => ({
                quantity: 1,
                price_data: {
                    unit_amount: product.price * 100,
                    currency: "usd",
                    product_data: {
                        name: product.name,
                        metadata: {
                            stripeAccountId: tenant.stripeAccountId,
                            id: product.id,
                            name: product.name,
                            price: product.price
                        } as ProductMetadata
                    }
                }
            }))


        const totalAmount = products.docs.reduce((acc, item) => acc + item.price * 100, 0)
        const platformFeePercent = Math.round((totalAmount / 10) * 100)

        const checkout = await stripe.checkout.sessions.create({
            customer_email: ctx.session.user.email,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?cancel=true`,
            mode: 'payment',
            line_items: lineItem,
            invoice_creation: {
                enabled: true
            },
            metadata: {
                userId: ctx.session.user.id,
            } as CheckoutMetadata,

            payment_intent_data: {
                application_fee_amount: platformFeePercent,
            }
        }, {
            stripeAccount: tenant.stripeAccountId,
        })


        if(!checkout.url) {
            throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create checkout session.'})
        }

        return  {
            url: checkout.url
        }

    }),
    getProducts: baseProcedure.input(
        z.object({
            ids: z.array(z.string())
    }))
        .query(async ({ctx,input}) => {
        const data = await ctx.db .find({
            collection: 'products',
            depth: 2,
            where: {
                id: {
                    in: input.ids,
                }
            }
        })
        if(data.totalDocs !== input.ids.length) {
            throw new TRPCError({code: "NOT_FOUND", message: "Product not found."})
        }
        return {
            ...data,
            totalPrice: data.docs.reduce((acc,product) => acc + product.price, 0),
            docs: data.docs.map(doc => ({
                ...doc,
                image: doc.image as Media,
                tenant: doc.tenant as Tenant & {image: Media | null}
            }))
        }
    })
})