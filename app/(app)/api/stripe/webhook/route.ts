import Stripe from "stripe";
import {stripe} from "@/lib/stripe";
import {NextResponse} from "next/server";
import {getPayload} from "payload";
import config from '@payload-config'
import {ExpandedLineItem} from "@/modules/checkout/types";
export async function POST(req: Request) {
    let event: Stripe.Event;


    try {
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
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

    console.log("Success")

    const permittedEvents: string[] = [
        "checkout.session.completed",
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
                                products: item.price.product.metadata.id,
                                name: item.price.product.name
                            }
                        })
                    }
                    break;
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