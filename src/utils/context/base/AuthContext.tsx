import { AxiosResponse } from "axios";
import React, { createContext, useCallback, useContext } from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useAccessToken, useRefreshToken } from "../hooks/hooks";
import { AuthenticationProps } from "./AdminRegistrationContext";
import { useRouter } from "next/router";
const context = createContext<{
  login(email: string, password: string): Promise<any>;
  checkAuthentication(currentScreen: string): Promise<any>;
}>(undefined as any);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const router = useRouter();
  const loginCb = useApiCallBack(
    (api, p: { email: string; password: string }) =>
      api.authentication.authenticationJwtLogin(p.email, p.password)
  );
  const [accessToken, setAccessToken] = useAccessToken();
  const [refreshToken, setRefreshToken] = useRefreshToken();
  const FetchAuthentication = useApiCallBack(
    async (api, args: AuthenticationProps) => {
      const result = await api.authentication.userAvailabilityCheck(args);
      return result;
    }
  );
  const IdentifyUsertype = useApiCallBack((api, uuid: any) =>
    api.mdr.IdentifyUserTypeFunc(uuid)
  );
  const login = async (email: any, password: any) => {
    const result = await loginCb.execute({
      email,
      password,
    });
    setAccessToken(result?.data?.accessToken);
    setRefreshToken(result?.data.refreshToken);
    return result;
  };
  const checkAuthentication = (currentScreen: string) => {
    return new Promise((resolve) => {
      let savedAuthStorage;
      const savedTokenStorage = localStorage.getItem("token");
      if (typeof savedTokenStorage == "string") {
        savedAuthStorage = JSON.parse(savedTokenStorage);
      }
      const uuid =
        localStorage.getItem("uid") === null ? 0 : localStorage.getItem("uid");
      if (savedAuthStorage == undefined || uuid == 0 || uuid == null) {
        localStorage.clear();
        router.push("/login");
        return;
      } else {
        FetchAuthentication.execute({
          userId: uuid == null ? 0 : uuid,
          savedAuth: savedAuthStorage == null ? null : savedAuthStorage,
        })
          .then((res: any) => {
            if (res == "no_saved_storage") {
              return;
            } else if (res?.data == "no_records") {
              return;
            } else if (res?.data == "not_match") {
              return;
            } else {
              IdentifyUsertype.execute(uuid)
                .then((identified: any) => {
                  if (currentScreen == "admin") {
                    if (
                      identified?.data == "Administrator" ||
                      identified?.data == "Developers"
                    ) {
                      return;
                    }
                  } else if (currentScreen == "login") {
                    if (
                      identified?.data == "Administrator" ||
                      identified?.data == "Developers"
                    ) {
                      router.push("/sys-admin/admin-dashboard");
                    }
                  } else if (currentScreen == "home") {
                    if (
                      identified?.data == "Administrator" ||
                      identified?.data == "Developers"
                    ) {
                      router.push("/sys-admin/admin-dashboard");
                    }
                  }
                })
                .catch((error) => {
                  localStorage.clear();
                  router.push("/login");
                });
            }
          })
          .catch((error) => {
            localStorage.clear();
            router.push("/login");
          });
      }
    }).catch((error) => {
      localStorage.clear();
      router.push("/login");
    });
  };
  return (
    <context.Provider
      value={{
        login,
        checkAuthentication,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAuthContext = () => {
  if (!context) {
    throw new Error("AuthProvider should be used");
  }

  return useContext(context);
};
