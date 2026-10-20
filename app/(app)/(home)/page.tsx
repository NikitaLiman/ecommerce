import type {SearchParams} from "nuqs/server";

import { getQueryClient,trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {loadProductFilter} from "@/modules/products/search-params";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";

interface IProps {
    searchParams: Promise<SearchParams>
}



const Page = async ({searchParams}: IProps) => {


    const filters = await loadProductFilter(searchParams);


    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {
            ...filters
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
            <ProductListView/>
        </HydrationBoundary>
    );
};

export default Page;