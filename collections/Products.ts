import type {CollectionConfig} from "payload";
import {isSuperAdmin} from "@/lib/access";
import {Tenant} from "@/payload-types";

export const Products: CollectionConfig = {
    slug: "products",
    access: {
        create: async ({ req }) => {
            if (!req.user) return false;
            if (isSuperAdmin(req.user)) return true;

            const relation = req.user.tenants?.[0]?.tenant;
            if (!relation) return false;

            const tenant = await req.payload.findByID({
                collection: "tenants",
                id: typeof relation === "object" ? relation.id : relation,
                depth: 0,
                overrideAccess: true,
            });

            return tenant.stripeDetailsSubmitted === true;
        },
    },
    },
    fields: [
        {
            name: "name",
            type: 'text',
            required: true,
        },
        {
            name: "description",
            type: 'text',
        },
        {
            name: "price",
            type: 'number',
            required: true,
            admin: {
                description: "Price in USD"
            }
        },
        {
            name: "category",
            type: 'relationship',
            relationTo: "categories",
            hasMany: false,
        },
        {
            name: "tags",
            type: 'relationship',
            relationTo: "tags",
            hasMany: true,
        },
        {
            name: "image",
            type: "upload",
            relationTo: "media"
        },
        {
            name: "refundOption",
            type: "select",
            options: ['30-day','14-day','7-day','1-day','no-refunds'],
            defaultValue: "30-day"
        },
        {
            name: "content",
            type: 'textarea',

            admin: {
                description: "Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bonus materials. Supports Markdown formatting.",
            }
        }
    ]
}