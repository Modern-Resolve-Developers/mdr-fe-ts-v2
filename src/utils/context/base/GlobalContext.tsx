import React, { createContext, useContext } from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";

type ContextValue = {
  globals: Tenant | null;
  getAuthenticatedRouter(requestId: string | undefined): Promise<any>
};

export type Tenant = {
  storedValue: string | undefined;
  storedType: number | undefined;
};

interface Props {
  globals: Tenant | null;
}

const GlobalContext = createContext<ContextValue>(undefined as any);

export const GlobalsProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  globals,
}) => {
  const getAuthenticatedRouterAPI = useApiCallBack(
    async (api, args: {
      requestId: string | undefined
    }) => await api.authentication.authenticatedRouter(args))
  const getAuthenticatedRouter = (requestId: string | undefined) => {
    return new Promise((resolve) => {
      const obj = {
        requestId : requestId
      }
      getAuthenticatedRouterAPI.execute(obj)
      .then((response: any) => {
        resolve(response.data)
      })
    })
  }
  return (
    <GlobalContext.Provider
      value={{
        globals,
        getAuthenticatedRouter
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalsContext = () => {
  if (!GlobalContext) {
    throw new Error("Globals must be used.");
  }
  return useContext(GlobalContext);
};
