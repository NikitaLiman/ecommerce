import {useCartStore} from "@/modules/checkout/store/use-cart-store";

export const useCart = (tenantSlug: string) => {
    const {
        getCartByTenantId,
        addProduct,
        removeProduct,
        clearAllCarts,
        clearCart
    } = useCartStore()

    const productsIds =  getCartByTenantId(tenantSlug);

    const toggleProduct = (productId: string) => {
        if(productsIds.includes(productId)) {
            removeProduct(tenantSlug,productId);
        } else {
            addProduct(tenantSlug,productId);
        }
    }


    const isProductInCart = (productId: string) => {
        return productsIds.includes(productId);
    }


    const clearTenantCart = () => {
        clearCart(tenantSlug);
    }

    return {
        productsIds,
        addProduct: (productId: string) => addProduct(tenantSlug, productId),
        removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        totalItems: productsIds.length,
        isProductInCart,
    }
}