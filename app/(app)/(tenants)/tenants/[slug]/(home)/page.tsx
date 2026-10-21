import {SearchParams} from "nuqs/server";
import {loadProductFilter} from "@/modules/products/search-params";
import {getQueryClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";

interface IProps {
    searchParams: Promise<SearchParams>
    params: Promise<{slug: string}>
}

const Page = async ({searchParams,params}: IProps) => {
    const {slug} = await params;
    const filters = await loadProductFilter(searchParams);

    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {
            tenantSlug: slug,
            ...filters,
            limit: DEFAULT_LIMIT,
        },
        {
            getNextPageParam: (lastPage) =>
                lastPage.hasNextPage
                    ? lastPage.nextPage ?? undefined
                    : undefined,
        }
    ))


    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView narrowView tenantSlug={slug}/>
        </HydrationBoundary>
  );
};

export default Page;