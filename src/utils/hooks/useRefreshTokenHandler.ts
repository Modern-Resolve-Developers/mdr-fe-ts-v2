import { AxiosError } from "axios";
import { useEffect, useRef } from "react";
import { AuthenticationRefreshTokenArgs } from "@/pages/api/Authentication/types";  
import { useAccessToken, useRefreshToken } from "../context/hooks/hooks";
import Http from "@/pages/api/http-client";
import { httpClient, useApiCallBack } from "./useApi";

export const useRefreshTokenHandler = () => {
    const [accessToken, setAccessToken] = useAccessToken()
    const [refreshToken, setRefreshToken] = useRefreshToken()
    const retryInProgressRequest = useRef<Promise<void> | null>()
    const refreshTokenCall = useApiCallBack((api, p: AuthenticationRefreshTokenArgs) => api.authentication.authenticationJwtRefreshToken(p))

    useEffect(() => httpClient.setupMiddlewareOptions({ onErrorHandler: handleRetry }),[])

    const handleRetry = async (err: AxiosError | any, http: Http) => {
        if (err.response?.status !== 401) {
            return Promise.reject(err);
          }

        if (!retryInProgressRequest.current) {
            retryInProgressRequest.current = refresh(err).then(() => {
              retryInProgressRequest.current = null;
            });
          }

        try {
            await retryInProgressRequest.current;
            http.options?.onRequest?.(err.config);
      
            return http.client(err.config);
          } catch {
            retryInProgressRequest.current = null;
          }
        return Promise.reject(err)
    }

    const refresh = async (error: AxiosError): Promise<void> => {
        if(accessToken && refreshToken){
            try {
                const result: any = await refreshTokenCall.execute({ AccessToken: accessToken, RefreshToken : refreshToken })
                setAccessToken(result.data.accessToken)
                setRefreshToken(result.data.refreshToken)
                return Promise.resolve()
            } catch (error) {
                throw error;
            }
        }
        return Promise.reject(error)
    }
}

