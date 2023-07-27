import { createContext, useState, useCallback, useContext, useEffect } from 'react'
import { ContextSetup, ToastContextSetup } from '..'
import { useApiCallBack } from '@/utils/hooks/useApi'
import { useAccessToken, useRefreshToken } from "../hooks/hooks";
import { useRouter } from 'next/router';

import { useQuery } from 'react-query'

export const ARContext = createContext<ContextSetup | null>(null)

type ARContextProps = {
    children: React.ReactNode
}

export type AuthenticationProps = {
    userId : any
    savedAuth : any
}


const AdminRegistrationContext: React.FC<ARContextProps> = ({
    children
}) => {
    const [accessToken, setAccessToken] = useAccessToken()
    const [refreshToken, setRefreshToken] = useRefreshToken()
    const fetchAllUsersExecutioner = useApiCallBack(async (api) => await api.users.fetchAllUsersFunc())
    const [isHidden, setIsHidden] = useState(false)
    const [tableLoading, setTableLoading] = useState(true)
    const [users, setUsers] = useState([])
    const FetchAuthentication = useApiCallBack(async (api, args: AuthenticationProps) => {
        const result = await api.authentication.userAvailabilityCheck(args)
        return result
    })
    const router = useRouter()
    const callBackSyncGetAllUsers = useCallback(() => {
        fetchAllUsersExecutioner.execute()        
        .then((response: any) => {
            const { data } : any = response;
            setUsers(data)
        }).catch(error => {
            if(error?.response?.status == 401){
                localStorage.clear()
                router.push('/login')
            }
        })
    }, [])
    const CheckAuthentication = () => {
       return new Promise((resolve, reject) => {
        let savedAuthStorage;
        const savedTokenStorage = localStorage.getItem('token')
        if(typeof savedTokenStorage == 'string'){
            savedAuthStorage = JSON.parse(savedTokenStorage)
        }
        const uuid = localStorage.getItem('uid') === null ? 0 : localStorage.getItem('uid')
        if(savedAuthStorage == undefined && uuid == 0) {
          return;
        } else {
            /* if the token is not valid or neither expired -> fetching API to get the user data breakdown will prohibited.  */
            const result = FetchAuthentication.execute({
              userId : uuid == null ? 0 : uuid,
              savedAuth: savedAuthStorage == null ? null : savedAuthStorage
            })
            return resolve(result)
        }
       })
    }
    return (
        <ARContext.Provider
        value={{
            isHidden, setIsHidden,
            CheckAuthentication,
            users, setUsers,
            callBackSyncGetAllUsers,
            tableLoading, setTableLoading
        }}
        >
            {children}
        </ARContext.Provider>
    )
}

export default AdminRegistrationContext