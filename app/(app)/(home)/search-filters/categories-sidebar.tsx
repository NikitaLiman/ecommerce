'use client'

import {CustomCategory} from "@/app/(app)/(home)/types";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {ChevronLeftIcon, ChevronRightIcon} from "lucide-react";
import {useRouter} from "next/navigation";

interface IProps {
    open: boolean;
    setIsSideBarOpen: (isSideBarOpen: boolean) => void;
    data: CustomCategory[];
}

export const CategoriesSideBar = ({open,setIsSideBarOpen,data}: IProps) => {

    const router = useRouter();

    const [parentCategory,setParentCategory] = useState<CustomCategory[] | null> (null);
    const [selectedCategory,setSelectedCategory] = useState<CustomCategory | null> (null);


    const backgroundColor = selectedCategory?.color || 'white'

    const handleOpenChange = (open: boolean)=> {
        setSelectedCategory(null);
        setParentCategory(null);
        setIsSideBarOpen(false);
    }

    const currentCategories = parentCategory ?? data ?? []

    const handleCategoryClick = (category: CustomCategory) => {
        if(category.subcategories && category.subcategories.length > 0){
            setParentCategory(category.subcategories as CustomCategory[])
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