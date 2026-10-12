import type { CollectionConfig } from 'payload'
import {unique} from "next/dist/build/utils";

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: "username",
      required: true,
      unique: true,
      type: "text"
    }
  ],
}
