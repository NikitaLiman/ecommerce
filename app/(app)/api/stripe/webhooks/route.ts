import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {NextResponse} from "next/server";
import {getPayload} from "payload";
import config from '@payload-config'
import {ExpandedLineItem} from "@/modules/checkout/types";



export async function POST(req: Request) {
    console.log("Webhook POST received");

    let event: Stripe.Event;


    try {
        event = stripe.webhooks.constructEvent(
            await req.text(),
            req.headers.get('stripe-signature') as string,
            process.env.STRIPE_SECRET_WEBHOOK as string,
        )
    } catch (error) {

        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if(error! instanceof Error) {
            console.log(errorMessage);
        }

        return NextResponse.json({ message: "Webhook returned error" }, {status: 400});
    }

    console.log("Webhook event:", event.type)

    const permittedEvents: string[] = [
        "checkout.session.completed",
        "account.updated"
    ]

    const payload = await getPayload({config})

    if(permittedEvents.includes(event.type)) {
        let data;

        try {
            switch (event.type) {
                case "checkout.session.completed":
                    data = event.data.object as Stripe.Checkout.Session;
                    if(!data.metadata?.userId){
                        throw new Error("User id is required");
                    }

                    const user = await payload.findByID({
                        collection: "users",
                        id: data.metadata.userId,
                    })

                    if(!user){
                        throw new Error("User id is required");
                    }

                    const expendedSession = await stripe.checkout.sessions.retrieve(
                        data.id,
                        {
                            expand: ['line_items.data.price.product']
                        },
                        {
                            stripeAccount: event.account,
                        }
                    );


                    if(
                        !expendedSession.line_items?.data ||
                        !expendedSession.line_items.data.length
                    ) {
                        throw new Error("No line items is found");
                    }

                    const lineItems = expendedSession.line_items.data as ExpandedLineItem[];

                    for(const item of lineItems) {
                        await payload.create({
                            collection: "orders",
                            data: {
                                stripeCheckoutSessionId: data.id,
                                user: user.id,
                                stripeAccountId: event.account,
                                products: item.price.product.metadata.id,
                                name: item.price.product.name
                            }
                        })
                    }
                    break;

                case "account.updated": {
                    const eventAccount = event.data.object as Stripe.Account;
                    // Read current state so an older delivery cannot restore stale data.
                    const account = await stripe.accounts.retrieve(eventAccount.id);

                    const result = await payload.update({
                        collection: "tenants",
                        where: {
                            stripeAccountId: {
                                equals: account.id,
                            },
                        },
                        data: {
                            stripeDetailsSubmitted: account.details_submitted,
                        },
                    });

                    if (result.errors.length > 0) {
                        throw new Error("Failed to update Stripe status for tenant");
                    }

                    console.log("Stripe tenant update:", {
                        accountId: account.id,
                        detailsSubmitted: account.details_submitted,
                        updatedTenants: result.docs.map((tenant) => tenant.id),
                        errors: result.errors,
                    });

                    break;
                }

                    default:
                        throw new Error(`Unknown event type ${event.type} `);
            }
        } catch(error) {
            console.error("Webhook error:", error);
            return NextResponse.json(
                {
                    message: "Webhook returned error",
                },
                {
                    status: 500
                }
            );
        }
    }
    return NextResponse.json({ message: "Received"}, {status: 200})
}