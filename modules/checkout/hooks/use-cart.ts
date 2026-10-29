import {useCartStore} from "@/modules/checkout/store/use-cart-store";
import {useCallback} from "react";
import {useShallow} from "zustand/react/shallow";

export const useCart = (tenantSlug: string) => {
    const addProduct = useCartStore((state) => state.addProduct)
    const removeProduct = useCartStore((state) => state.removeProduct)
    const clearAllCarts = useCartStore((state) => state.clearAllCarts)
    const clearCart = useCartStore((state) => state.clearCart)

    const productsIds =  useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []));
    const toggleProduct = useCallback((productId: string) => {
        if(productsIds.includes(productId)) {
            removeProduct(tenantSlug,productId);
        } else {
            addProduct(tenantSlug,productId);
        }
    }, [addProduct, removeProduct,tenantSlug]);


    const isProductInCart = useCallback((productId: string) => {
        return productsIds.includes(productId);
    },[productsIds])


    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug);
    }, [tenantSlug, clearCart]);


    const handleAddProduct = useCallback((productId: string) => {
        addProduct(tenantSlug,productId);
    }, [tenantSlug,addProduct]);
    const handleRemoveProduct = useCallback((productId: string) => {
        removeProduct(tenantSlug,productId);
    }, [tenantSlug,removeProduct]);

    return {
        productsIds,
        addProduct: handleAddProduct,
        removeProduct: handleRemoveProduct,
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        totalItems: productsIds.length,
        isProductInCart,
    }
}