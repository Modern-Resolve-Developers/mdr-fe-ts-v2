import { AxiosResponse } from "axios";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useApiCallBack, useSecureHiddenNetworkApi } from "@/utils/hooks/useApi";
import { useAccessToken, useReferences, useRefreshToken, useRouting, useTokens, useUserId, useUserType, useuid } from "../hooks/hooks";
import { AuthenticationProps } from "./AdminRegistrationContext";
import { useRouter } from "next/router";
import { decrypt, encrypt } from "@/utils/secrets/hashed";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { Alert, AlertColor, Typography } from "@mui/material";
import { CreateAuthHistoryArgs, CreateTokenArgs, LoginProps, RequestRouterParams, Tokens } from "@/pages/api/Authentication/types";
import { useToastContext } from "./ToastContext";
import { useLoaders } from "./LoadingContext";
const context = createContext<{
  login(email: string | undefined, password: string | undefined): void;
  checkAuthentication(currentScreen: string): Promise<any>;
  AccessTokenExpired(token: string): boolean
  tokenExpired: boolean
  TrackTokenMovement(): boolean
  signoutProcess(): void
  expirationTime: any
  AlertTracker(message: string, severity: AlertColor | undefined) : React.ReactNode
  FormatExpiry(milliseconds: number | null): string
  isMouseMoved: boolean
  isKeyPressed: boolean
  refreshTokenBeingCalled(): void
  accessToken: string | undefined
  disableRefreshTokenCalled: boolean
  setDisableRefreshTokenCalled: any
  handleResendCode(type: string, email: string | undefined) : void
  maxResentWith401: any
  formatCooldownTime(seconds: number) : string
  cooldown: any
  cooldownIsActive: boolean
  remainingTime: number
  resendCheckCounts(email: string | undefined) : void
  resendRevalidate(email: string | undefined) : void
}>(undefined as any);
interface JwtProps extends JwtPayload {
  exp?: number
}
export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const { handleOnToast } = useToastContext()
  const { setLoading } = useLoaders()
  const router = useRouter();
  const [maxResentWith401, setMaxResentWith401] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const secureResendCode = useSecureHiddenNetworkApi(
    async (api, args: {type: string, email: string | undefined}) => await api.secure.sla_begin_resending_code(args)
)
  const loginCb = useSecureHiddenNetworkApi(
    async (api, args:LoginProps) => await api.secure.sla_begin_work_login(args)
  )
  const tokenCb = useSecureHiddenNetworkApi(
    async (api, args: CreateTokenArgs) => await api.secure.sla_begin_work_create_token(args)
  )
  const historyCb = useSecureHiddenNetworkApi(
    async (api, args: CreateAuthHistoryArgs) => await api.secure.sla_begin_work_create_auth_history(args)
  )
  const JwtloginCb = useSecureHiddenNetworkApi(
    async (api, args: {jwtusername: string | undefined, jwtpassword: string | undefined }) => await api.secure.sla_begin_work_login_jwt(args)
  )
  const FetchAuthCb = useSecureHiddenNetworkApi(
    async (api, userId: number) => await api.secure.sla_begin_fetching_saved_histories(userId)
  )
  const FoundAuthCb = useApiCallBack(
    async (api, args: RequestRouterParams) => 
    await api.authentication.authenticatedRouter(args)
  )
  const [disableRefreshTokenCalled, setDisableRefreshTokenCalled] = useState<boolean>(false)
  const [isMouseMoved, setIsMouseMoved] = useState<boolean>(false)
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false)
  const signoutInProgress = useApiCallBack((api, uuid: any) => api.mdr.signoutUser(uuid))
  const refreshTokenCalled = useSecureHiddenNetworkApi(
    async (api, args: Tokens) => await api.secure.sla_begin_work_refresh_tokens(args)
  )
  const [accessSavedAuth, setAccessSavedAuth] = useTokens()
  const [accessUserId, setAccessUserId] = useuid()
  const [references, setReferences] = useReferences()
  const [dr, setDr] = useRouting()
  const [accessToken, setAccessToken] = useAccessToken();
  const [refreshToken, setRefreshToken] = useRefreshToken();
  const [uuid, setUUID] = useUserId()
  const [utype, setUType] = useUserType()
  const [tokenExpired, setTokenExpired] = useState<boolean>(false)
  const [expirationTime, setExpirationTime] = useState<number | null>(null)
  const [cooldownIsActive, setCoolDownIsActive] = useState<boolean>(false)
  const FetchAuthentication = useApiCallBack(
    async (api, args: AuthenticationProps) => {
      const result = await api.authentication.userAvailabilityCheck(args);
      return result;
    }
  );
  const secureCheckResentCounts = useSecureHiddenNetworkApi(
    async (api, email: string) => await api.secure.sla_begin_checking_resent_code(email)
  )
  const secureValidationResent = useSecureHiddenNetworkApi(
    async (api, email: string) => await api.secure.sla_begin_revalidate_resent_code(email)
  )
  const [cooldown, setCooldown] = useState<any>(null)
  const resendRevalidate = (
    email: string | undefined
  ) => {
    secureValidationResent.execute(email)
    .then((res: AxiosResponse | undefined) => {
      if(res?.data == 200) {
        setMaxResentWith401(200)
      }
    })
  }
  const resendCheckCounts = (
    email: string | undefined
  ) => {
    secureCheckResentCounts.execute(email)
    .then((res: AxiosResponse | undefined) => {
        if(res?.data == 3) {
          setMaxResentWith401(401)
        } else if(res?.data >= 5) {
          setMaxResentWith401(400)
        } else {
          setMaxResentWith401(200)
        }
    })
  }
  const handleResendCode = (type: string, email: string | undefined) => {
    secureResendCode.execute(
      {
        type: type,
        email: email
      }
    ).then((response: AxiosResponse | undefined) => {
      if(response?.data?.status == 401) {
        setCooldown(response?.data?.cooldown)
        setCoolDownIsActive(!cooldownIsActive)
        handleOnToast(
          "Successfully sent verification code",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
        );
        setMaxResentWith401(response?.data?.status)
      } else if(response?.data == 400) {
        setMaxResentWith401(response?.data)
      } else {
        handleOnToast(
          "Successfully sent verification code",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
        );
        setMaxResentWith401(response?.data)
      }
    })
  }
  const formatCooldownTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  const refreshTokenBeingCalled = () => {
    const tokens = {
      AccessToken: accessToken,
      RefreshToken: refreshToken
    }
    refreshTokenCalled.execute(tokens).then((response: AxiosResponse | undefined) => {
      setAccessToken(response?.data?.accessToken)
      setRefreshToken(response?.data?.refreshToken)
    })
  }
  const AccessTokenExpired = (token: string | undefined) => {
    try {
      const decodedToken = jwt.decode(token ?? "") as JwtProps
      if(decodedToken && typeof decodedToken.exp === 'number'){
        const expiryTime = decodedToken.exp ? new Date(decodedToken.exp * 1000) : null
        if(expiryTime) {
          const currentTime = new Date()
          const timeDiff = expiryTime.getTime() - currentTime.getTime()
          if(timeDiff <= 0) {
            setExpirationTime(null)
          }
          else {
            setExpirationTime(timeDiff)
          }
        }
        return Date.now() >= decodedToken.exp * 1000
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return true;
  }
  const FormatExpiry = (milliseconds: number | null) : string => {
    if(milliseconds !== null) {
      const totalSeconds = Math.floor(milliseconds / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      return `${minutes} minutes and ${seconds} seconds.`
    }
    return ''
  }
  const AlertTracker = (message: string, severity: AlertColor | undefined) => {
    return (
      <div style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 9999
      }}>
        <Alert severity={severity ?? "error"}>{message}</Alert>
      </div>
    )
  }
  const checkAccessToken = () => {
    const expired = AccessTokenExpired(accessToken)
    setTokenExpired(expired)
    return expired
  }
  const TrackTokenMovement = () => {
    return checkAccessToken()
  }
  const signoutProcess = () => {
    signoutInProgress.execute(uuid)
    .then((response: AxiosResponse | undefined) => {
      if(response?.data == 'success_destroy'){
        localStorage.clear()
        router.push('/login')
      }
    })
  }
  useEffect(() => {
    checkAccessToken()
    const intervalId = setInterval(checkAccessToken, 1000)
    return () => clearInterval(intervalId)
  }, [accessToken])
  useEffect(() => {
    if(cooldownIsActive) {
      setRemainingTime(cooldown * 60)
      const countInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if(prevTime <= 1) {
            setCoolDownIsActive(false)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => {
        clearInterval(countInterval)
        setCoolDownIsActive(false)
        setRemainingTime(0)
      }
    }
  }, [cooldownIsActive])
  useEffect(() => {
    const handleMouseMove = () => {
      setIsMouseMoved(true)
    }
    const handleKeyPress = () => {
      setIsKeyPressed(true)
    }

    window.addEventListener('click', handleMouseMove)
    window.addEventListener('keydown', handleKeyPress)
    const intervalId = setInterval(() => {
      setIsMouseMoved(false)
      setIsKeyPressed(false)
    }, 1000)
    return () => {
      window.addEventListener('click', handleMouseMove)
      window.addEventListener('keydown', handleKeyPress)
      clearInterval(intervalId)
    }
  }, [])
  const IdentifyUsertype = useApiCallBack((api, uuid: any) =>
    api.mdr.IdentifyUserTypeFunc(uuid)
  );
  const login = async (email: string | undefined, password: string | undefined) => {
    const loginArgs: LoginProps = {
      email: email,
      password: password
    }
    loginCb.execute(loginArgs)
    .then((response: AxiosResponse | undefined) => {
      if(response?.data == "NOT_FOUND"){
        setLoading(false)
        handleOnToast(
          "User not found",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
      } else if(response?.data == "INVALID_PASSWORD") {
        setLoading(false)
        handleOnToast(
          "Invalid Password, Please try again.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
      } else if(response?.data == "ACCOUNT_LOCK") {
        setLoading(false)
        handleOnToast(
          "Your account is currently lock. Please contact administrator.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
      } else {
        const tokenCreation = {
          userId: response?.data?.bundle[0]?.id,
          token: "auto-generated-token-backend-side"
        }
        tokenCb.execute(tokenCreation)
        .then((authAfter: AxiosResponse | undefined) => {
          if(authAfter?.data?.message == 'token-creation-success'
          || authAfter?.data?.message == 'token-exist-success') {
            const savedObj = {
              firstname: response?.data?.bundle[0]?.firstname,
              lastname: response?.data?.bundle[0]?.lastname,
              email: response?.data?.bundle[0]?.email,
              userId: response?.data?.bundle[0]?.Id,
              token: authAfter?.data?.tokenResult[0]?.token
            }
            const structure = {
              userId: response?.data?.bundle[0]?.id,
              savedAuth: "auto-generated-backend-area",
              preserve_data: JSON.stringify(savedObj)
            }
            historyCb.execute(structure)
            .then((repository: AxiosResponse | undefined) => {
              if(repository?.data == 'success-save-auth-history'
              || repository?.data == 'save-auth-exist'){
                const JwtProps = {
                  jwtusername: email,
                  jwtpassword: password
                }
                JwtloginCb.execute(JwtProps)
                .then((JwtAfterAuthSubmission: AxiosResponse | undefined) => {
                  setDr(response?.data?.routeInfo)
                  setReferences(response?.data?.bundle[0])
                  const uuid: string | undefined = JSON.stringify(response?.data?.bundle[0]?.id)
                  setUUID(uuid)
                  const access_level: string | undefined = JSON.stringify(response?.data?.bundle[0]?.userType)
                  setUType(encrypt(access_level.toString()))
                  setAccessToken(JwtAfterAuthSubmission?.data?.token)
                  setRefreshToken(JwtAfterAuthSubmission?.data?.refreshToken)
                  FetchAuthCb.execute(structure.userId)
                  .then((savedRepo: AxiosResponse | undefined) => {
                    setAccessSavedAuth(savedRepo?.data?.token[0]?.savedAuth)
                    setAccessUserId(structure.userId)
                    setDisableRefreshTokenCalled(false)
                    setLoading(false)
                    handleOnToast(
                      "Successfully Logged in.",
                      "top-right",
                      false,
                      true,
                      true,
                      true,
                      undefined,
                      "dark",
                      "success"
                    );
                    const reqParams = {
                      requestId: response?.data?.routeInfo
                    }
                    console.log(reqParams)
                    FoundAuthCb.execute(reqParams)
                    .then((authpath: AxiosResponse | undefined) => {
                      router.push({
                        pathname: authpath?.data?.exactPath,
                        query : {
                          key: response?.data?.bundle[0]?.id
                        }
                      })
                    })
                  })
                })
              }
            })
          }
        })
      }
    })
  };
  /**
   * @deprecated checkAuthentication will remove on release V5
   */
  const checkAuthentication = (currentScreen: string) => {
    return new Promise((resolve) => {
      let savedAuthStorage;
      const savedTokenStorage = localStorage.getItem("token");
      if (typeof savedTokenStorage == "string") {
        savedAuthStorage = JSON.parse(savedTokenStorage);
      }
      const uuid: any =
        localStorage.getItem("uid") === null ? 0 : localStorage.getItem("uid");
      if (savedAuthStorage == undefined || parseInt(decrypt(uuid)) == 0 || parseInt(decrypt(uuid)) == null) {
        localStorage.clear();
        router.push("/login");
        return;
      } else {
        FetchAuthentication.execute({
          userId: uuid == null ? 0 : parseInt(decrypt(uuid)),
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
              IdentifyUsertype.execute(parseInt(decrypt(uuid)))
                .then((identified: any) => {
                  if (currentScreen == "admin") {
                    if (
                      identified?.data == 1
                    ) {
                      return;
                    }
                  } else if (currentScreen == "login") {
                    if (
                      identified?.data == 1
                    ) {
                      router.push("/sys-admin/admin-dashboard");
                    }
                  } else if (currentScreen == "home") {
                    if (
                      identified?.data == 1
                    ) {
                      router.push("/sys-admin/admin-dashboard");
                    } else {return;}
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
        AccessTokenExpired,
        tokenExpired,
        TrackTokenMovement,
        signoutProcess,
        expirationTime,
        AlertTracker,
        FormatExpiry,
        isMouseMoved,
        isKeyPressed,
        refreshTokenBeingCalled,
        accessToken,
        disableRefreshTokenCalled, setDisableRefreshTokenCalled,
        handleResendCode,
        formatCooldownTime,
        maxResentWith401,
        cooldown,
        cooldownIsActive,
        remainingTime,
        resendCheckCounts,
        resendRevalidate
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
