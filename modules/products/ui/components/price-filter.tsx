
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

interface IProps {
    minPrice?: string | null;
    maxPrice?: string | null;
    onMinPriceChange?: (minPrice: string) => void;
    onMaxPriceChange?: (maxPrice: string) => void;
}

export const formatAsCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    const parts = numericValue.split(".");

    const formattedValue = parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0,2) : '');


    if(!formattedValue) return "";

    const numberValue = parseFloat(formattedValue);

    if(isNaN(numberValue)) return "";

    return Intl.NumberFormat('en-US', {style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2})
        .format(numberValue);
}


export const PriceFilter = ({minPrice,maxPrice,onMaxPriceChange,onMinPriceChange}: IProps) => {

    const handleMinimumPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, "");
        if (onMinPriceChange) {
            onMinPriceChange(numericValue);
        }
    }
    const handleMaximumPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = e.target.value.replace(/[^0-9]/g, "");
        if (onMaxPriceChange) {
            onMaxPriceChange(numericValue);
        }
    }


    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-2 '>
                <Label className='font-medium text-base'>
                    Minimum Price
                </Label>
                <Input
                    type='text'
                    placeholder='$0'
                    value={minPrice ? formatAsCurrency(minPrice) : ''}
                    onChange={handleMinimumPriceChange}
                />
                <Label className='font-medium text-base'>
                    Maximum Price
                </Label>
                <Input
                    type='text'
                    placeholder='∞'
                    value={maxPrice ? formatAsCurrency(maxPrice) : ''}
                    onChange={handleMaximumPriceChange}
                />
            </div>
        </div>
    )

}