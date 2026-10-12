'use client'

import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {CategoriesGetManyOutputs} from "@/modules/categories/types";

interface IProps {
    open: boolean;
    setIsSideBarOpen: (isSideBarOpen: boolean) => void;
}

export const CategoriesSideBar = ({open,setIsSideBarOpen}: IProps) => {

    const rtpc = useTRPC()

    const {data} = useQuery(rtpc.categories.getMany.queryOptions())

    const router = useRouter();

    const [parentCategory,setParentCategory] = useState<CategoriesGetManyOutputs | null> (null);
    const [selectedCategory,setSelectedCategory] = useState<CategoriesGetManyOutputs[1] | null> (null);


    const backgroundColor = selectedCategory?.color || 'white'

    const handleOpenChange = (open: boolean)=> {
        setSelectedCategory(null);
        setParentCategory(null);
        setIsSideBarOpen(false);
    }

    const currentCategories = parentCategory ?? data ?? []

    const handleCategoryClick = (category: CategoriesGetManyOutputs[1]) => {
        if(category.subcategories && category.subcategories.length > 0){
            setParentCategory(category.subcategories as CategoriesGetManyOutputs)
            setSelectedCategory(category)
        } else {
            if(parentCategory && selectedCategory){
                router.push(`/${selectedCategory.slug}/${category.slug}`)
            } else {
                if(category.slug === 'all') {
                     router.push('/')
                } else {
                    router.push(`/${category.slug}`)
                }
            }
            handleOpenChange(false)
        }
    }


    const handleBackButton = () => {
        if(parentCategory){
            setSelectedCategory(null)
            setParentCategory(null)
        }
    }
    return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
        side='left'
        className='p-0 transition-none'
        style={{backgroundColor: backgroundColor}}>
            <SheetHeader className='p-4 border-b'>
                <SheetTitle>
                    Categories
                </SheetTitle>
            </SheetHeader>
            <ScrollArea className='flex flex-col overflow-y-auto h-full pb-2'>
                {parentCategory &&
                    (
                        <button
                            className='cursor-pointer w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium'
                            onClick={() => handleBackButton()}>
                            <ChevronLeftIcon className='size-4 mr-2'/>
                            Back
                        </button>
                    )
                }
                {currentCategories.map((category) => (
                    <button onClick={() => handleCategoryClick(category)}  className='cursor-pointer w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium' key={category.slug}>
                        {category.name}
                        {category.subcategories && category.subcategories.length > 0 && (
                            <ChevronRightIcon className='size-4 mr-2'/>
                        )}
                    </button>
                ))}
            </ScrollArea>
        </SheetContent>
    </Sheet>
  );
};