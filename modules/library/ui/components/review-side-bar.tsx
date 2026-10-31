import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {ReviewForm} from "@/modules/library/ui/components/review-form";

interface IProps {
    productId: string;
}

export const ReviewSideBar = ({productId}: IProps) => {

    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.reviews.getOne.queryOptions({
        productId,
    }))

  return (
    <div>
        <ReviewForm productId={productId} initialData={data} />
    </div>
  );
};