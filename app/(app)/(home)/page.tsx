import Image from "next/image";
import {getQueryClient, trpc} from "@/trpc/server";

export default async function Home() {


    const queryClient = getQueryClient()

    const category = await queryClient.fetchQuery(trpc.categories.getMany.queryOptions())

  return (
  <div>
      Home

      {JSON.stringify(category, null, 2)}
  </div>
  );
}
