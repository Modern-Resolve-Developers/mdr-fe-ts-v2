import { createContext } from "react";
import { SessionStorageContextSetup } from "..";
import { useSessionStorage } from "@/utils/hooks/useSessionStorage";

export const SessionContextMigrate = createContext<SessionStorageContextSetup | null>(null)

type SessionContextProps = {
    children: React.ReactNode
}

type AccessSavedAuth = {
    savedAuth : any
  }
  
  type AccessUserId = {
    userId : number | any
  }

const SessionContext: React.FC<SessionContextProps> = ({
    children
}) => {
    const [accessSavedAuth, setAccessSavedAuth, clearAccessSavedAuth] = useSessionStorage<AccessSavedAuth | null>('token', null)
    const [accessUserId, setAccessUserId, clearAccessUserId] = useSessionStorage<AccessUserId | null>('uid', null)

    return (
        <SessionContextMigrate.Provider
        value={{
            accessSavedAuth, setAccessSavedAuth, clearAccessSavedAuth,
            accessUserId, setAccessUserId, clearAccessUserId
        }}
        >{children}</SessionContextMigrate.Provider>
    )
}

export default SessionContext