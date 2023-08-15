import { Api } from "@/pages/api/api";
import { useAsync, useAsyncCallback } from 'react-async-hook';
import { MdrApi } from "@/pages/api/mdr/api";
import Http, { HttpOptions } from "@/pages/api/http-client";
import { config } from "../config";
import { AxiosInstance, AxiosError } from "axios";
import { UsersApi } from "@/pages/api/users/api";
import { AuthenticationApi } from "@/pages/api/Authentication/api";

import { getItem } from "../session-storage";
import { SecureApi } from "@/pages/api/secure-api";
import { ServerLessApi } from "@/pages/api/Serverless/api";


const HTTP_OPTIONS: HttpOptions = {
    headers: {
        "Content-Type" : "application/json",
        "x-api-key" : config.value.AUTH_TOKEN
    },
    onRequest: (req: any) => {
        const accessToken = getItem<string | undefined>('AT')
        if(req.headers && accessToken) req.headers.Authorization = `Bearer ${accessToken}`
    }
}
const SELF_HTTP_OPTIONS: HttpOptions = {
    headers: {
        "Content-Type": "application/json",
        "x-api-key" : config.value.AUTH_TOKEN
    },
    onRequest: (req: any) => {
        const accessToken = getItem<string | undefined>('AT')
        if(req.headers && accessToken) req.headers.Authorization = `Bearer ${accessToken}`
    }
}

export const SelfHttpClient = new Http({ ...SELF_HTTP_OPTIONS, baseURL: config.value.SELF_URI })
export const httpClient = new Http({ ...HTTP_OPTIONS, baseURL : config.value.TENANT_URL })
export const httpSsrClient = new Http({
    ...HTTP_OPTIONS,
    baseURL: config.value.TENANT_URL
})
export const useApiCallBack = <R, A extends unknown>(asyncFn: (api: Api, args: A) => Promise<R>) =>
    
useAsyncCallback(async (args?: A) => {
        try {
            return await asyncFn(createApi(httpClient.client), args as A);
        } catch (e: any) {
            handleError(e)
        }
})

export const useSecureHiddenNetworkApi = <R, A extends unknown>(asyncFn: (api: SecureApi, args: A) => Promise<R>) => useAsyncCallback(async (args?: A) => {
    try {
        return await asyncFn(secureCreateApi(SelfHttpClient.client), args as A)
    } catch (error) {
        handleError(error)
    }
}) 

function createApi(client: AxiosInstance){
    return new Api(
        new AuthenticationApi(client),
        new MdrApi(client),
        new UsersApi(client)
    )
}

function secureCreateApi(client: AxiosInstance){
    return new SecureApi(
        new ServerLessApi(client)
    )
}

function handleError(e: any) {
   const rawErrors = e.response.data?.errors
   return Array.isArray(rawErrors) ? rawErrors.map(e => e.code ?? 'Something went wrong') : ['Something went wrong']
}