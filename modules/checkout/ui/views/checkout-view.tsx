'use client'
import {useTRPC} from "@/trpc/client";
import {toast} from 'sonner'

import {useQuery} from "@tanstack/react-query";
import {useCart} from "@/modules/checkout/hooks/use-cart";
import {useEffect} from "react";
import {generateTenantURL} from "@/lib/utils";
import {CheckoutItem} from "@/modules/checkout/ui/components/checkout-item";
import {CheckoutSidebar} from "@/modules/checkout/ui/components/checkout-sidebar";
import {InboxIcon, LoaderIcon} from "lucide-react";

interface IProps {
    tenantSlug: string;
}

export const CheckoutView = ({tenantSlug}: IProps) => {
    const trpc = useTRPC()

    const {productsIds,clearAllCarts,removeProduct} = useCart(tenantSlug);



    const { data, error,isLoading } = useQuery(trpc.checkout.getProducts.queryOptions({
        ids: productsIds
    }))

    useEffect(() => {
        if(!error) return;


        if(error?.data?.code === "NOT_FOUND") {
            clearAllCarts();
            toast.warning('Invalid products found, cart cleared')
        }


    },[error])

    if(isLoading) {
        return (
            <div className='lg:pt-16 pt-4 px-4 lg:px-12'>
                <div className='border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg'>
                   <LoaderIcon className='text-muted-foreground animate-spin'/>
                </div>
            </div>
        )
    }

    if(data?.totalDocs === 0) return (
        <div className='lg:pt-16 pt-4 px-4 lg:px-12'>
            <div className='border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg'>
                <InboxIcon/>
                <p className='text-base font-medium'>No products found</p>
            </div>
        </div>
    )

    return (
    <div className='lg:pt-16 pt-4 px-4 lg:px-12'>
        <div className='grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16'>

            <div className='lg:col-span-4'>
                <div className='border rounded-mb overflow-hidden bg-white'>
                    {data?.docs.map((product,index) => (
                        <CheckoutItem
                            key={product.id}
                            isLast={index === data.docs.length - 1}
                            imageUrl={product.image?.url}
                            name={product.name}
                            productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                            tenantUrl={`${generateTenantURL(product.tenant.slug)}`}
                            tenantName={product.tenant.name}
                            price={product.price}
                            onRemove={() => removeProduct(product.id)}
                        />
                    ))}
                </div>
            </div>
            <div className='lg:col-span-3'>
               <CheckoutSidebar
                    total={data?.totalPrice || 0}
                    onCheckout={() => {}}
                    isCanceled={true}
                    isPending={false}
               />
            </div>

        </div>
    </div>
  );
};