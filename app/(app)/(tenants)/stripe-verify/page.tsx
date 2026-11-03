'use client'

import {useTRPC} from "@/trpc/client";
import {useMutation} from "@tanstack/react-query";
import {useEffect} from "react";
import {LoaderIcon} from "lucide-react";

const Page = () => {

    const trpc = useTRPC()
    const { mutate: verify } = useMutation(
        trpc.checkout.verify.mutationOptions({
            onSuccess: (data) => {
                console.log("Ответ checkout.verify:", data)

                if (data.url) {
                    window.location.assign(data.url)
                } else {
                    console.error("Сервер не вернул ссылку Stripe")
                }
            },
            onError: (error) => {
                console.error("Ошибка checkout.verify:", error.message)
            },
        })
    )




    useEffect(() => {
        verify()
    }, [verify])

  return (
    <div className='min-h-screen flex justify-center items-center'>
        <LoaderIcon className='animate-spin text-black' />
    </div>
  );
};

export default Page;