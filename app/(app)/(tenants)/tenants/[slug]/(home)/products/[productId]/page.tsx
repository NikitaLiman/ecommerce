import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductView} from "@/modules/products/ui/views/product-view";

interface IProps {
    params: Promise<{productId: string; slug: string}>
}

const Page = async ({params}: IProps) => {
  const {productId,slug} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug,
    }))

    return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductView productId={productId} tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default Page;