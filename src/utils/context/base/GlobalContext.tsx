import React, { createContext, useContext } from "react";

type ContextValue = {
  globals: Tenant | null;
};

export type Tenant = {
  storedValue: string | undefined;
  storedType: number | undefined;
};

interface Props {
  globals: Tenant | null;
}

const GlobalContext = createContext<ContextValue>({
  globals: null,
});

export const GlobalsProvider: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  globals,
}) => {
  return (
    <GlobalContext.Provider
      value={{
        globals,
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
