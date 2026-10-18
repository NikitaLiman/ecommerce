'use client'

import {useProductFilters} from "@/modules/products/hooks/use-products-filters";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export const ProductSort = () => {
  const [filters,setFilters] = useProductFilters()

    return (
    <div className='flex items-center gap-2'>
        <Button
            onClick={() => setFilters({sort: 'curated'})}
            variant='secondary' size='lg' className={cn('bg-white hover:bg-white rounded-full',
                filters.sort !== 'curated' &&
                    "bg-transparent border-transparent hover:border-border hover:bg-transparent "
            )}>
            Curated
        </Button>
        <Button
            onClick={() => setFilters({sort: 'trending'})}
            variant='secondary' size='lg' className={cn('bg-white hover:bg-white rounded-full',
            filters.sort !== 'trending' &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent "
        )}>
            Trending
        </Button>
        <Button
            onClick={() => setFilters({sort: 'hot_and_new'})}
            variant='secondary' size='lg' className={cn('bg-white hover:bg-white rounded-full',
            filters.sort !== 'hot_and_new' &&
            "bg-transparent border-transparent hover:border-border hover:bg-transparent "
        )}>
            Hot and New
        </Button>
    </div>
  );
};