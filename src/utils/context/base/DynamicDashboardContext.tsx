import { createContext, useContext, useState } from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";

const DynamicDashboardContext = createContext<{
  getPropsDynamic(uuid: any): Promise<any>;
}>(undefined as any);

export const DynamicDashboardProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const IdentifyUsertype = useApiCallBack((api, uuid: any) =>
    api.mdr.IdentifyUserTypeFunc(uuid)
  );
  const getPropsDynamic = (uuid: any) => {
    return new Promise((resolve) => {
      IdentifyUsertype.execute(uuid).then((response) => {
        return resolve(response);
      });
    });
  };
  return (
    <DynamicDashboardContext.Provider
      value={{
        getPropsDynamic,
      }}
    >
      {children}
    </DynamicDashboardContext.Provider>
  );
};

export const useDynamicDashboardContext = () => {
  if (!DynamicDashboardContext) {
    throw new Error("DynamicDashboardContext should be used");
  }
  return useContext(DynamicDashboardContext);
};
