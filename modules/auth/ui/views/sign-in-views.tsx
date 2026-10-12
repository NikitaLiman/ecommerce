'use client'
import {Poppins} from 'next/font/google'
import {Controller, useForm} from "react-hook-form";
import {loginSchema} from "@/modules/auth/schemas";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useTRPC} from "@/trpc/client";
import  {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";


const poppins = Poppins({
    subsets: ['latin'],
    weight: "700"
})

export const SignInViews = () => {

    const router = useRouter();

    const trpc = useTRPC();

    const login = useMutation(trpc.auth.login.mutationOptions(
        {
            onError: (
                error
            ) => [
                toast.error(error.message)
            ],
            onSuccess: () => {
                router.push("/ ");
            }
        }
    ));

    const form = useForm<z.infer<typeof loginSchema>>({
        mode: "all",
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })


    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        login.mutate(values)
    }



    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className='bg-[#F4F4F0] h-screen w-full lg:col-span-3 overflow-auto'>

                <form id="sign-up-form" className='flex flex-col gap-8 p-4 lg:p-16' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-8">
                        <Link href='/'>
                            <span className={cn('text-2xl font-semibold', poppins.className)}>funroad</span>
                        </Link>
                        <Button
                            variant='ghost'
                            size='sm'
                            className="text-base border-none underline">
                            <Link prefetch href='/sign-up'>
                                Sign Up
                            </Link>
                        </Button>
                    </div>
                    <h1 className={'text-4xl font-medium'}>
                        Welcome back to Funroad.
                    </h1>
                    <FieldGroup>
                        <Controller
                            name='email'
                            control={form.control}
                            render={({field,fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='sign-up-email'>
                                        Email
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id='sign-up-email'
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Enter the email'
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
                            name='password'
                            control={form.control}
                            render={({field,fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor='sign-up-password'>
                                        Password
                                    </FieldLabel>
                                    <Input

                                        {...field}
                                        type='password'
                                        id='sign-up-password'
                                        aria-invalid={fieldState.invalid}
                                        placeholder='Enter the password'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                    <Button
                        disabled={login.isPending }
                        type={'submit'}
                        size='lg'
                        variant='elevated'
                        className={cn('bg-black text-white hover:bg-pink-400 hover:text-primary')}
                    >
                        Log in
                    </Button>
                </form>
            </div>
            <div
                style={{backgroundImage: `url('/auth-bg.png')`,backgroundSize: 'cover',backgroundPosition: 'center'}}
                className='h-screen w-full lg:col-span-2 hidden lg:block'>
                bg- column
            </div>
        </div>
    );
};