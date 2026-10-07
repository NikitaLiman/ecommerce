import {inferRouterOutputs} from "@trpc/server";

import type {AppRouter} from "@/trpc/routers/_app";


export type CategoriesGetManyOutputs = inferRouterOutputs<AppRouter>['categories']['getMany'];

export type CategoriesGetManyOutputsSingle = CategoriesGetManyOutputs[0];


