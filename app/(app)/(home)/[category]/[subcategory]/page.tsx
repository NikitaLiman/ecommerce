import { getQueryClient,trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {loadProductFilter} from "@/modules/products/search-params";
import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import  {SearchParams} from "nuqs/server";

interface IProps {
    params: Promise<{
        subcategory: string
    }>,
    searchParams: Promise<SearchParams>
}



const Page = async ({params,searchParams}: IProps) => {

    const {subcategory} = await params;

    const filters = await loadProductFilter(searchParams);


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.products.getMany.queryOptions({
        category: subcategory,
        ...filters
    }))
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductListView category={subcategory}/>
        </HydrationBoundary>
    );
};

export default Page;