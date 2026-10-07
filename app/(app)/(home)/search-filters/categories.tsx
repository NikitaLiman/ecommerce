'use client'
import {CategoryDropdown} from "@/app/(app)/(home)/search-filters/category-dropdown";
import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {ListFilterIcon} from "lucide-react";
import {CategoriesSideBar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {CategoriesGetManyOutputs} from "@/modules/categories/types";

interface IProps {
    data: CategoriesGetManyOutputs;
}
export const Categories = ({data}: IProps) => {

    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);

    const [visibleCount, setVisibleCount] = useState<number>(data.length);
    const [isAnyHovered, setIsAnyHovered] = useState(false);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);

    const activeCategory = "all"


    const activeCategoryId = data.findIndex((category) => category.slug === activeCategory);
    const isActiveCategoryHidden = activeCategoryId >= visibleCount && activeCategoryId !== -1;


    useEffect(() => {
        const calculateVissible = () => {
            if(!containerRef.current || !measureRef.current || !viewAllRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const viewAllWidth = viewAllRef.current.offsetWidth;
            const avaibleWidth = containerWidth - viewAllWidth;


            const items = Array.from(measureRef.current.children);

            let totalWidth = 0
            let visible = 0

            for (const item of items) {
                const width = item.getBoundingClientRect().width;
                if(totalWidth + width > avaibleWidth) break;
                totalWidth += width;
                visible++;
            }
            setVisibleCount(visible);
        }

        const resizeObserver = new ResizeObserver(calculateVissible);
        resizeObserver.observe(containerRef.current!);

        return () => {
            resizeObserver.disconnect();
        }

    },[data.length])

    return (
    <div className='relative w-full '>
        {/*{"Categories sidebar"}*/}
        <CategoriesSideBar  open={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen}/>

        <div style={{position: "fixed", top: -9999, left: -9999}} ref={measureRef} className='absolute opacity-0 pointer-events-none flex'>
            {data.map((category) => (
                <div key={category.id}>
                    <CategoryDropdown
                        category={category}
                        isActive={activeCategory === category.slug}
                        isNavigationHovered={false}
                    />
                </div>
            ))}
        </div>


        <div ref={containerRef} onMouseEnter={() => setIsAnyHovered(true)} onMouseLeave={() => setIsAnyHovered(false)}  className='flex flex-nowrap items-center'>
           {data.slice(0,visibleCount).map((category) => (
               <div key={category.id}>
                   <CategoryDropdown
                       category={category}
                       isActive={activeCategory === category.slug}
                       isNavigationHovered={isAnyHovered}
                   />
               </div>
           ))}

            <div ref={viewAllRef} className='shrink-0'>
                <Button onClick={() => setIsSideBarOpen(true )} className={cn('h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black',
                    isActiveCategoryHidden && !isAnyHovered && "bg-white border-primary" )}>View All <ListFilterIcon className='ml-2'/></Button>
            </div>
       </div>


    </div>
  );
};