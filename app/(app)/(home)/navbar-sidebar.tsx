import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import Link from "next/link";

interface INavbarItem {
    href: string,
    children: React.ReactNode,
}

interface INavbarSidebar {
    items: INavbarItem[],
    open: boolean,
    onOpenChange: (open: boolean) => void;
}

export const NavbarSidebar = ({items,open,onOpenChange}: INavbarSidebar) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
        side={'left'}
        className='p-0 transition-none'>
            <SheetHeader className='p-4 border-b'>
                <div className='flex items-center'>
                    <SheetTitle>
                        Menu
                    </SheetTitle>
                </div>
            </SheetHeader>
            <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
                {items.map((item, i) => (
                    <Link className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium' key={item.href} href={item.href}>
                        {item.children}
                    </Link>
                ))}
                <div className='border-t'>
                    <Link className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium' href={'/sign-in'}>
                        Log in
                    </Link>
                    <Link className='w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium' href={'/sign-up'}
                    >
                        Start selling
                    </Link>
                </div>
            </ScrollArea>
        </SheetContent>

    </Sheet>
  );
};