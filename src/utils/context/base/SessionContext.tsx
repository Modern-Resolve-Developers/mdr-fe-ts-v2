import { createContext } from "react";
import { SessionStorageContextSetup } from "..";
import { useSessionStorage } from "@/utils/hooks/useSessionStorage";
import { useTokens, useuid } from "../hooks/hooks";

export const SessionContextMigrate = createContext<SessionStorageContextSetup | null>(null)

type SessionContextProps = {
    children: React.ReactNode
}

export type AccessSavedAuth = {
    savedAuth : any
  }
  
export type AccessUserId = {
    userId : number | any
}

const SessionContext: React.FC<SessionContextProps> = ({
    children
}) => {
    const [accessSavedAuth, setAccessSavedAuth, clearAccessSavedAuth] = useTokens()
    const [accessUserId, setAccessUserId, clearAccessUserId] = useuid()

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