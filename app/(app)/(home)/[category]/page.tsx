import type {SearchParams} from "nuqs/server";

import { getQueryClient,trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {loadProductFilter} from "@/modules/products/search-params";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";

interface IProps {
    params: Promise<{
        category: string
    }>,
    searchParams: Promise<SearchParams>
}



const Page = async ({params,searchParams}: IProps) => {

    const {category} = await params;

    const filters = await loadProductFilter(searchParams);


    const queryClient = getQueryClient();
    void queryClient.prefetchInfiniteQuery(trpc.products.getMany.infiniteQueryOptions(
        {
        category,
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
           <ProductListView category={category}/>
        </HydrationBoundary>
    );
};

export default Page;