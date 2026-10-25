import {formatCurrency} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {CircleXIcon} from "lucide-react";

interface IProps {
    total: number;
    onCheckout: () => void;
    isCanceled?: boolean;
    isPending?: boolean;
}

export const CheckoutSidebar = ({
    total,
    onCheckout,
    isCanceled,
    isPending,
                                }: IProps
) => {
  return (
    <div className='border rounded-md overflow-hidden bg-white flex flex-col'>
        <div className='flex items-center justify-between p-4 border-b'>
            <h4 className='font-medium text-lg'>Total</h4>
            <p className='font-medium text-lg'>{formatCurrency(total)}</p>
        </div>
        <div className=' flex items-center justify-center p-4'>
            <Button
                variant='elevated'
                disabled={isPending}
                onClick={onCheckout}
                size='lg'
                className='text-base w-full text-white bg-primary hover:bg-pink-400 hover:text-primary'
            >
                Checkout
            </Button>
        </div>
        {isCanceled && (
            <div className='flex items-center justify-center p-4 border-t'>
                <div className='bg-red-100 border-red-400 font-medium px-3 py-4 rounded flex items-center w-full'>
                    <div className='flex items-center'>
                        <CircleXIcon className='size-6 mr-2 fill-red-500 text-red-100'/>
                        <span>Checkout failed. Please try again.</span>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};