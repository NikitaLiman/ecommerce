'use client'

import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {Categories} from "@/app/(app)/(home)/search-filters/categories";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";


export const SearchFilters = () => {
    const trpc = useTRPC()

    const {data} = useSuspenseQuery(trpc.categories.getMany.queryOptions())

  return (
    <div style={{backgroundColor: "#F5F5F5"}} className="px-4 lg:px-12 py-8 border-b flex flex-col full-w gap-4">
        <SearchInput/>
       <div className='hidden lg:block'>
           <Categories data={data}/>
       </div>
    </div>
  );
};

export const SearchInputLoading = () => {
    return (
        <div style={{backgroundColor: "#F5F5F5"}}  className="px-4 lg:px-12 py-8 border-b flex flex-col full-w gap-4"  >
            <SearchInput disabled/>
            <div className='hidden lg:block'>
              <div className='h-11'/>
            </div>
        </div>
    )
}
