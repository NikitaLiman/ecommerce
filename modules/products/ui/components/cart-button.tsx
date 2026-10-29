import {useCart} from "@/modules/checkout/hooks/use-cart";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import Link from "next/link";

interface  IProps {
    tenantSlug: string;
    productId: string;
    ispurchased?: boolean;
}

export const CartButton = ({tenantSlug,productId,ispurchased}: IProps) => {
    const cart = useCart(tenantSlug);

    if(ispurchased) {
        return  (
            <Button
                variant='ghost'
                className='flex-1 font-medium bg-white'
            >
                <Link  href={`/liblary/${productId}`}>
                    View in Library
                </Link>
            </Button>
        )
    }

    return (
        <Button
            variant='elevated'
            className={cn('flex-1 bg-pink-400', cart.isProductInCart(productId) && "bg-white")}
            onClick={() => cart.toggleProduct (productId)}
        >
            {cart.isProductInCart(productId) ?
                "Remove from cart"
                :
                "Add to cart"
            }
        </Button>
  );
};