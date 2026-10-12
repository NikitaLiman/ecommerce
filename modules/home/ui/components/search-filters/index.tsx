'use client'

import {SearchInput} from "@/modules/home/ui/components/search-filters/search-input";
import {Categories} from "@/modules/home/ui/components/search-filters/categories";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {DEFAULT_BG_COLOR} from "@/modules/home/constants";
import {BreadCrumbNav} from "@/modules/home/ui/components/search-filters/bread-crumbs-nav";


export const SearchFilters = () => {
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.categories.getMany.queryOptions())
    const params = useParams()
    const categoryParam = params?.category as string | undefined;
    const activeCategory = categoryParam || 'all'

    const activeCategoryData = data.find((category) => category.slug === activeCategory )

    const activeCategoryColor = activeCategoryData?.color || DEFAULT_BG_COLOR
    const activeCategoryName = activeCategoryData?.name || null
    const activeSubCategory = params.subcategory as string | undefined;
    const activeSubCategoryName = activeCategoryData?.subcategories.find((category) => category.slug === activeSubCategory)?.name || null || null
  return (
    <div style={{backgroundColor: activeCategoryColor}} className="px-4 lg:px-12 py-8 border-b flex flex-col full-w gap-4">
        <SearchInput/>
       <div className='hidden lg:block'>
           <Categories data={data}/>
       </div>
        <BreadCrumbNav
            activeCategoryName={activeCategoryName}
            activeCategory={activeCategory}
            activeSubCategoryName={activeSubCategoryName}

        />
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
