import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import {Categories} from "./collections/Categories";
import {Products} from "@/collections/Products";
import {Tags} from "@/collections/Tags";
import {Tenants} from "@/collections/Tenants";
import {multiTenantPlugin} from "@payloadcms/plugin-multi-tenant";
import {Orders} from "@/collections/Orders";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media,Categories,Products,Tags,Tenants,Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || "",
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      collections: {
        products: {
          useBaseFilter: false,
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },

      useUsersTenantFilter: false, // ← добавь эту строку

      userHasAccessToAllTenants: (user) =>
          Boolean(user?.roles?.includes("super-admin")),
    }),
  ],
});
