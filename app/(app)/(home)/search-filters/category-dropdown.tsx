'use client'
import {Category} from "@/payload-types";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {useRef, useState} from "react";
import {useDropdownPositions} from "@/app/(app)/(home)/search-filters/ use-dropdown-position";
import {SubCategoryMenu} from "@/app/(app)/(home)/search-filters/SubCategoryMenu";

interface IProps {
    category: Category;
    isActive: boolean;
    isNavigationHovered: boolean;
}

export const CategoryDropdown = ({category,isNavigationHovered,isActive}: IProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {getDropdownPositions} = useDropdownPositions(dropdownRef);


    const dropDownPosition = getDropdownPositions()

    const onMouseEnter = (e: React.MouseEvent) => {
        if(category.subcategories) {
            setIsOpen(true);
        }
    }

    const onMouseLeave = (e: React.MouseEvent) => setIsOpen(false);
  return (
    <div className='relative' ref={dropdownRef} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} >
       <div className='relative'>
           <Button className={cn('h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black', isActive && !isNavigationHovered && "bg-white border-primary" )} variant='elevated'>
               {category.name}
           </Button>
           {category.subcategories && category.subcategories.length > 0 &&
               (
                   <div
                       className={cn(
                           'absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 opacity-0 border-b-[10px] border-r-[10px] border-l-[10px] border-b-black border-r-transparent border-l-transparent',
                           isOpen && 'opacity-100'
                       )}
                   />
               )
           }
       </div>
        <SubCategoryMenu
            category={category}
            isOpen={isOpen}
            position={dropDownPosition}
        />
    </div>
  );
};