'use client'

import {BookmarkCheckIcon, ListFilterIcon, SearchIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {CategoriesSideBar} from "@/modules/home/ui/components/search-filters/categories-sidebar";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import Link from "next/link";

interface IProps {
    disabled?: boolean;
}

export const SearchInput = ({disabled }: IProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC()

    const session = useQuery(trpc.auth.session.queryOptions())

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
        {session.data?.user && (
            <Button variant='elevated'>
                <Link className='flex items-center'  href='/Library'>
                    <BookmarkCheckIcon className='mr-2'/>
                    Library
                </Link>
            </Button>
        )}

    </div>
  );
};


