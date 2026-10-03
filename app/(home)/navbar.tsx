'use client'

import {Poppins} from 'next/font/google'
import Link from "next/link";
import {cn} from "cn";
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {NavbarSidebar} from "@/app/(home)/navbar-sidebar";
import React from "react";
import {MenuIcon} from "lucide-react";

const poppins = Poppins({
    subsets: ['latin'],
    weight: "700"
})
interface INavbarItems {
    href: string,
    children: React.ReactNode,
    isActive?: boolean,
}

const NavbarItem = ({children,isActive,href}: INavbarItems) => {
     return (
         <Button
             variant='outline' className={cn('bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg',isActive && 'bg-black text-white hover:bg-black hover:text-white' )}>
             <Link href={href}>
                 {children}
             </Link>
         </Button>
     )
}

const navbarItems = [
    {href:'/', children:'Home'},
    {href:'/about', children:'About'},
    {href:'/feature', children:'Feature'},
    {href:'/pricing', children:'Pricing'},
    {href:'/contact', children:'Contact'},
]

export const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const pathName = usePathname()
  return (
    <nav className='h-20 flex border-b justify-between  font-medium bg-white'>
        <Link href='/' className='pl-6 flex items-center'>
            <span className={cn('text-5xl font-semibold', poppins.className)}>
                funroad
            </span>
        </Link>
        
        <NavbarSidebar items={navbarItems} open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}/>

        <div className='items-center gap-4 hidden lg:flex'>
            {navbarItems.map((item) => (
                <NavbarItem isActive={pathName === item.href} key={item.href} href={item.href}>
                    {item.children}
                </NavbarItem>
            ))}
        </div>
        <div className='hidden lg:flex'>
            <Button
                variant='secondary' className='border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white
        hover:bg-pink-400 transition-colors text-lg'>
               <Link href={'/sign-in'}>
                   Log in
               </Link>
            </Button>
            <Button className='border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white
        hover:bg-pink-400 hover:text-black transition-colors text-lg'>
                <Link href={'/sign-up'}>
                   start selling
                </Link>
            </Button>
        </div>
        <div className='lg:hidden flex items-center justify-center'>
            <Button variant='ghost' className='size-12 border-transparent bg-white' onClick={()=>setIsOpen(true)}>
                <MenuIcon />
            </Button>
        </div>
    </nav>
  );
};