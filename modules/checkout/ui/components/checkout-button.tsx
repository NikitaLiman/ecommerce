import {useCart} from "@/modules/checkout/hooks/use-cart";
import {Button} from "@/components/ui/button";
import {cn, generateTenantURL} from "@/lib/utils";
import Link from "next/link";
import {ShoppingCartIcon} from "lucide-react";


interface IProps {
    className?: string;
    hideIfEmpty?: boolean;
    tenantSlug: string;
}

export const CheckoutButton = ({
    className,
    hideIfEmpty = false,
    tenantSlug,
                               }: IProps) => {
    const {totalItems} = useCart(tenantSlug);

    if(hideIfEmpty && totalItems === 0) return null;



    return (
        <Button
            variant='elevated'
            className={cn('bg-white', className)}
        >
            <Link className='flex items-center gap-x-1' href={`${generateTenantURL(tenantSlug)}/checkout`} passHref>
                <ShoppingCartIcon/> {totalItems > 0 ? totalItems : ''}
            </Link>
        </Button>
  );
};