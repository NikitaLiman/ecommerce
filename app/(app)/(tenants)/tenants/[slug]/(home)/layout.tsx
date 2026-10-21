import {Navbar, NavBarSkeleton} from "@/modules/tenants/ui/components/navbar";
import {Footer} from "@/modules/tenants/ui/components/footer";
import {getQueryClient, trpc} from "@/trpc/server";
import {DEFAULT_LIMIT} from "@/modules/tags/constants";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {Suspense} from "react";


interface IProps {
    children: React.ReactNode;
    params: Promise<{slug: string}>
}

const layout = async ({children,params}: IProps) => {

    const {slug} = await params;

    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({
        slug,
    }))

    return (
    <div className={"min-h-screen bg-[#f4f4f0] flex flex-col"}>
        <HydrationBoundary state={dehydrate(queryClient)}>
           <Suspense fallback={<NavBarSkeleton/>}>
               <Navbar slug={slug} />
           </Suspense>
        </HydrationBoundary>
        <div className='flex-1'>
          <div className={'max-w(--breakpoint-xl) mx-auto'}>
              {children}
          </div>
        </div>

        <Footer/>
    </div>
  );
};

export default layout;