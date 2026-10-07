'use client'

import {ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSideBar} from "@/app/(app)/(home)/search-filters/categories-sidebar";
import {useState} from "react";
import {Button} from "@/components/ui/button";

interface IProps {
    disabled?: boolean;
}

export const SearchInput = ({disabled }: IProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
    <div className='flex items-center gap-2 w-full'>
        <CategoriesSideBar open={isSidebarOpen} setIsSideBarOpen={setIsSidebarOpen}/>
        <div className='relative w-full'>
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500"  />
            <Input className='pl-8' placeholder='Search products' disabled={disabled} />
        </div>
        <Button onClick={() => setIsSidebarOpen(true)} className='size-12 shrink-0 flex lg:hidden' variant='elevated'>
            <ListFilterIcon/>
        </Button>
    </div>
  );
};


