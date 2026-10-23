export { cn } from "cn"


export function generateTenantURL(tenantSlug: string) {
    return `/tenants/${tenantSlug}`
}

export const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("en-US", {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(Number(value))
}