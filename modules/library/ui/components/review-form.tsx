import {ReviewGetOneOutput} from "@/modules/reviews/types";
import {z} from "zod";
import {Controller, FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {StarPicker} from "@/components/star-picker";
import {useTRPC} from "@/trpc/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

interface IProps {
    productId: string;
    initialData?: ReviewGetOneOutput;
}


const formSchema = z.object({
    rating: z.number().min(1, "Rating is required").max(5),
    description: z.string().min(1, "Description is required"),
})

export const ReviewForm = ({productId,initialData}: IProps) => {

    const [isPreview, setIsPreview] = useState(!!initialData);

    const trpc = useTRPC()

    const queryClient = useQueryClient();

    const createReview = useMutation(trpc.reviews.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId,
            })),
                setIsPreview(true)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const updateReview = useMutation(trpc.reviews.update.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(trpc.reviews.getOne.queryOptions({
                productId,
            })),
            setIsPreview(true)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    }))

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rating: initialData?.rating ?? 0,
            description: initialData?.description ?? ''
        }
    });


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if(initialData) {
            updateReview.mutate({
                reviewId: initialData.id,
                rating: data.rating,
                description: data.description
            })
        } else  {
            createReview.mutate({
                productId,
                rating: data.rating,
                description: data.description
            })
        }
    }

    return (
      <FormProvider {...form}>
          <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
              <p className='font-medium'>
                  {isPreview ? "Your rating" : 'Liked it? Give it a rating'}
              </p>
              <FieldGroup>
                  <Controller
                      name='rating'
                      control={form.control}
                      render={({field,fieldState}) => (
                          <Field data-invalid={fieldState.invalid}>
                              <StarPicker
                                disabled={isPreview}
                                value={field.value}
                                onChange={field.onChange}
                              />
                              {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                              )}
                          </Field>
                      )}
                  />
              </FieldGroup>
              <FieldGroup>
                  <Controller
                      name='description'
                      control={form.control}
                      render={({field,fieldState}) => (
                          <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor='description'>
                                  Email
                              </FieldLabel>
                              <Textarea
                                  disabled={isPreview}
                                  {...field}
                                  id='description'
                                  aria-invalid={fieldState.invalid}
                                  placeholder='Enter the description'
                              />
                              {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                              )}
                          </Field>
                      )}
                  />
              </FieldGroup>
              {!isPreview && (
                  <Button
                    variant='elevated'
                    disabled={createReview.isPending || updateReview.isPending}
                    type='submit'
                    size={'lg'}
                    className='bg-black text-white hover:bg-pink-400 hover:text-primary w-fit'
                  >
                      {initialData ? "Update review" : 'Post review'}
                  </Button>
              )}
          </form>
          {isPreview && (
              <Button
                  className='mt-4 w-fit '
                  size='lg'
                  variant='elevated'
                  type={'button'}
                  onClick={() => setIsPreview(false)}>
                  Edit
              </Button>
          )}
      </FormProvider>
  );
};