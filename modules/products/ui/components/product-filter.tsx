'use client'

import {useState} from "react";
import {ChevronDownIcon, ChevronRightIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {PriceFilter} from "@/modules/products/ui/components/price-filter";
import {useProductFilters} from "@/modules/products/hooks/use-products-filters";

interface ProductFilterProps {
    title?: string,
    clasName?: string,
    children?: React.ReactNode,
}


const ProductFilter = ({title,clasName,children}: ProductFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const Icon = isOpen ? ChevronDownIcon : ChevronRightIcon

    return (
        <div className={cn(
            "p-4 border-b flex flex-col gap-2",
            clasName
        )}>
            <div onClick={() => {setIsOpen(!isOpen)}}
                 className='flex items-center justify-between cursor-pointer'
            >
                <p className='font-medium'>{title}</p>
                <Icon className='size-5'/>
            </div>
            {isOpen && children}
        </div>
    )
}


export const ProductFilters = () => {
    const [filters,setFilters] = useProductFilters();

    const onChange = (key: keyof typeof filters,value: unknown) => {
        setFilters({...filters, [key]: value});
    }
    return  (
        <div className='border rounded-md bg-white'>
            <div className='p-4 border-b flex items-center justify-between'>
                <p className='font-medium'>Product Filter</p>
                <button className='underline' onClick={() => {}} type='button'>
                    Clear
                </button>
            </div>
            <ProductFilter title='Price'>
               <PriceFilter
                maxPrice={filters.maxPrice}
                minPrice={filters.minPrice}
                onMaxPriceChange={(value) => onChange('maxPrice', value)}
                onMinPriceChange={(value) => onChange('minPrice', value)}
               />
            </ProductFilter>
        </div>
    )
}