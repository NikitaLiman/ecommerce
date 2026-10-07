

import {Navbar} from "@/app/(app)/(home)/navbar";
import {Footer} from "@/app/(app)/(home)/footer";
import {SearchFilters, SearchInputLoading} from "@/app/(app)/(home)/search-filters";


import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";

interface IProps {
    children?: React.ReactNode
}

const Layout = async ({children}: IProps) => {

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.categories.getMany.queryOptions()
    )


  return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<SearchInputLoading/>}>
               <SearchFilters />
           </Suspense>
        </HydrationBoundary>

        <div className='flex-1 bg-[#F4F4F0]'>{children}</div>
        <Footer/>
    </div>
  );
};

export default Layout;