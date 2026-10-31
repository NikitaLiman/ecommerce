import {LibraryView} from "@/modules/library/ui/views/library-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {LibraryProductView} from "@/modules/library/ui/views/library-product-view";


interface IProps {
    params: Promise<{
        productId: string;
    }>
}

const LibraryProductPage = async ({params}: IProps) => {

    const {productId} = await params;


  const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.library.getOne.queryOptions({productId}));

    void queryClient.prefetchQuery(trpc.reviews.getOne.queryOptions({productId}));

  return (
  <HydrationBoundary state={dehydrate(queryClient)}>
    <LibraryProductView productId={productId} />
  </HydrationBoundary>
  );
};

export default LibraryProductPage;