import { AxiosResponse } from "axios";
import React, { createContext, useCallback, useContext } from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useAccessToken, useRefreshToken } from "../hooks/hooks";

const context = createContext<{
    login(email: string, password: string): Promise<any>
}>(undefined as any)

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const loginCb = useApiCallBack((api, p: {email: string, password: string}) => api.authentication.authenticationJwtLogin(p.email, p.password))
    const [accessToken, setAccessToken] = useAccessToken()
    const [refreshToken, setRefreshToken] = useRefreshToken()
    const login = async (email : any, password: any) => {
        const result = await loginCb.execute({
            email,
            password
        });
        setAccessToken(result?.data?.accessToken)
        setRefreshToken(result?.data.refreshToken)
        return result;
    }
    return (
        <context.Provider 
        value={{
            login
        }}
        >{children}</context.Provider>
    )
}

export const useAuthContext = () => {
    if(!context){
        throw new Error('AuthProvider should be used')
    }

    return useContext(context)
}