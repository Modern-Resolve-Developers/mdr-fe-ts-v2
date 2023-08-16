import { AxiosError, AxiosResponse } from "axios";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useApiCallBack, useSecureHiddenNetworkApi } from "@/utils/hooks/useApi";
import { useAccessToken, useDevice, useDeviceId, useReferences, useRefreshToken, useRouting, useTokens, useUserId, useUserType, useuid } from "../hooks/hooks";
import { AuthenticationProps } from "./AdminRegistrationContext";
import { useRouter } from "next/router";
import { decrypt, encrypt } from "@/utils/secrets/hashed";
import jwt, {JwtPayload} from 'jsonwebtoken'
import { Alert, AlertColor, AlertTitle, Typography } from "@mui/material";
import { AuthenticationRefreshTokenArgs, CreateAuthHistoryArgs, CreateTokenArgs, LoginProps, RequestDeviceRecognition, RequestRouterParams, TokenStore, Tokens } from "@/pages/api/Authentication/types";
import { useToastContext } from "./ToastContext";
import { useLoaders } from "./LoadingContext";
import { useCookies } from "react-cookie";
import { ControlledModal } from "@/components";
import { NormalButton } from "@/components/Button/NormalButton";

type deviceApprovedProps = {
  deviceId: string
  email: string
}

type devicePromptApprovalProps = {
  openState: boolean
  handleClose?: () => void
  handleAuthApproved: () => void
  handleAuthDeclined: () => void
  content: React.ReactNode
}

const context = createContext<{
  login(email: string | undefined, password: string | undefined): void;
  checkAuthentication(currentScreen: string): Promise<any>;
  AccessTokenExpired(token: string): boolean
  tokenExpired: boolean
  TrackTokenMovement(): boolean
  signoutProcess(type: string): void
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
  deviceInfo(): void
  compressedDeviceInfo: string | undefined
  requestNum: number
  devicePromptApproval: (props: devicePromptApprovalProps) => React.ReactNode
  toBeEncryptedPassword: string | undefined
  requestGetNums(): void
  approveIncomingDevice(deviceId: string | undefined, email: string) : void
  cookies: any
  approvedDeviceTrigger(email: string | undefined): void
  declineIncomingDevice(deviceId: string | undefined, email: string) : void
  isApprovedDeviceAlive: number
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
  const [isApprovedDeviceAlive, setIsApprovedDeviceAlive] = useState<number>(0)
  const [maxResentWith401, setMaxResentWith401] = useState<number | null>(null)
  const [compressedDeviceInfo, setCompressedDeviceInfo] = useState<string | undefined>(undefined)
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [deviceId, setDeviceId] = useDeviceId()
  const [toBeEncryptedPassword, setToBeEncryptedPassword] = useState<string | undefined>(undefined)
  const [cookies, setCookie, removeCookies] = useCookies(['deviceId'])
  const secureResendCode = useSecureHiddenNetworkApi(
    async (api, args: {type: string, email: string | undefined}) => await api.secure.sla_begin_resending_code(args)
)
  const loginCb = useSecureHiddenNetworkApi(
    async (api, args:LoginProps) => await api.secure.sla_begin_work_login(args)
  )
  const deviceCb = useSecureHiddenNetworkApi(
    async (api, args: RequestDeviceRecognition) => await api.secure.sla_begin_device_recognition(args)
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
  const FetchRequestCb = useApiCallBack(
    async (api, deviceId: string | undefined) => await api.users.deviceGetRequest(deviceId)
  )
  const approveDevice = useApiCallBack(
    async (api, args: {
      deviceId: string | undefined,
      email: string
    }) => await api.users.authDeviceApproval(args)
  )
  const declineDevice = useApiCallBack(
    async (api, args: {
      deviceId: string | undefined,
      email: string
    }) => await api.users.authDeviceDecline(args)
  )
  const FoundAuthCb = useApiCallBack(
    async (api, args: RequestRouterParams) => 
    await api.authentication.authenticatedRouter(args)
  )
  const deviceRequestCb = useApiCallBack(
    async (api, email: string | undefined) => 
    await api.users.deviceRequestUpdate(email)
  )
  const [disableRefreshTokenCalled, setDisableRefreshTokenCalled] = useState<boolean>(false)
  const [isMouseMoved, setIsMouseMoved] = useState<boolean>(false)
  const [isKeyPressed, setIsKeyPressed] = useState<boolean>(false)
  const signoutInProgress = useApiCallBack((api, uuid: any) => api.mdr.signoutUser(uuid))
  const refreshTokenCalled = useSecureHiddenNetworkApi(
    async (api, args: Tokens) => await api.secure.sla_begin_work_refresh_tokens(args)
  )
  const [accessSavedAuth, setAccessSavedAuth, clearSavedAuth] = useTokens()
  const [accessUserId, setAccessUserId, clearuid] = useuid()
  const [references, setReferences, clearReferences] = useReferences()
  const [dr, setDr, clearDr] = useRouting()
  const [accessToken, setAccessToken, clearAccessToken] = useAccessToken();
  const [refreshToken, setRefreshToken, clearRefreshToken] = useRefreshToken();
  const [uuid, setUUID, clearUUID] = useUserId()
  const [utype, setUType, clearUType] = useUserType()
  const [tokenExpired, setTokenExpired] = useState<boolean>(false)
  const [expirationTime, setExpirationTime] = useState<number | null>(null)
  const [cooldownIsActive, setCoolDownIsActive] = useState<boolean>(false)
  const [requestNum, setRequestNum] = useState(0)
  const [device, setDevice, clearDevice] = useDevice()
  const FetchAuthentication = useApiCallBack(
    async (api, args: AuthenticationProps) => {
      const result = await api.authentication.userAvailabilityCheck(args);
      return result;
    }
  );
  const refreshTokenCall = useApiCallBack((api, p: AuthenticationRefreshTokenArgs) => api.authentication.authenticationJwtRefreshToken(p))
  const revokeCb = useApiCallBack(
    async (api, email: string) => await api.authentication.authrevoke(email)
  )
  const revokeDeviceCb = useApiCallBack(
    async (api, email: string) => await api.users.revokeDevice(email)
  )
  const secureCheckResentCounts = useSecureHiddenNetworkApi(
    async (api, email: string) => await api.secure.sla_begin_checking_resent_code(email)
  )
  const secureValidationResent = useSecureHiddenNetworkApi(
    async (api, email: string) => await api.secure.sla_begin_revalidate_resent_code(email)
  )
  const APTCb = useApiCallBack(
    async (api, email: string) => await api.users.approvedDeviceTriggered(email)
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
  const approvedDeviceTrigger = (email: string | undefined) => {
    APTCb.execute(email)
    .then((trigger: AxiosResponse | undefined) => {
      /**
       * Change this logic from boolean to integer
       * once received 1 then approved else 2 means declined
       */
      setIsApprovedDeviceAlive(trigger?.data)
    })
  }
  const devicePromptApproval = (props: devicePromptApprovalProps) => {
    const {
      openState,
      handleClose,
      handleAuthApproved,
      handleAuthDeclined,
      content
    } = props;
    return (
      <>
        <ControlledModal
        open={openState}
        buttonTextAccept="APPROVE"
        buttonTextDecline="DECLINE"
        color="success"
        handleDecline={handleAuthDeclined}
        handleSubmit={handleAuthApproved}
        enableDecline={false}
        >
          {content}
        </ControlledModal>
      </>
    )
  }
  const declineIncomingDevice = (deviceId: string | undefined, email: string) => {
    const obj: {
      deviceId: string | undefined,
      email: string
    } = {
        deviceId: deviceId,
        email: email
    }
    setLoading(true)
    declineDevice.execute(obj)
    .then((response: AxiosResponse | undefined) => {
      if(response?.data == 200){
        setRequestNum(0)
        handleOnToast(
          "Device declined.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "warning"
        );
        setLoading(false)
      }
    }).catch((err: AxiosError) => {
      if(err.response?.status == 401) {
        handleOnToast(
          "Something went wrong unauthorized request.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
        localStorage.clear()
      } else {
        handleOnToast(
          "Something went wrong.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
      }
    })
  }
  const approveIncomingDevice = (deviceId: string | undefined, email: string) => {
    const obj: {
      deviceId: string | undefined,
      email: string
    } = {
        deviceId: deviceId,
        email: email
    }
    setLoading(true)
    approveDevice.execute(obj)
    .then((response: AxiosResponse | undefined) => {
      if(response?.data == 200){
        handleOnToast(
          "Approved successfully.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "success"
        );
        signoutProcess("revoke-approved")
        setLoading(false)
      }
    }).catch((err: AxiosError) => {
      if(err.response?.status == 401) {
        handleOnToast(
          "Something went wrong unauthorized request.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
        localStorage.clear()
      } else {
        handleOnToast(
          "Something went wrong.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
      }
    })
  }
  const deviceInfo = () => {
    if(!navigator){
      console.log("device info is not available.")
      return;
    }
    const deviceInf = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      isMobile: /Mobi/.test(navigator.userAgent)
    }
    setCompressedDeviceInfo(JSON.stringify(deviceInf))
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
  const refreshTokenBeingCalled = async () => {
    if(accessToken && refreshToken) {
      try {
        const result: any = await refreshTokenCall.execute({
          AccessToken: accessToken, RefreshToken: refreshToken
        })
        setAccessToken(result.data.accessToken)
        setRefreshToken(result.data.refreshToken)
      } catch (error) {
        throw error;
      }
    }
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
        <Alert severity={severity ?? "error"}>
          <AlertTitle>Idle Timer</AlertTitle>
          {message}
        </Alert>
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
  const signoutProcess = (type: string) => {
    switch(type){
      case "expired":
        signoutInProgress.execute(uuid)
        .then((response: AxiosResponse | undefined) => {
          if(response?.data == 'success_destroy'){
            clearAccessToken()
            clearReferences()
            clearDevice()
            clearRefreshToken()
            clearDr()
            clearSavedAuth()
            clearUType()
            clearuid()
            clearUUID()
            router.push('/login')
          }
        })
        break;
      case "revoke-approved":
        signoutInProgress.execute(uuid)
        .then((response: AxiosResponse | undefined) => {
          if(response?.data == 'success_destroy'){
            revokeCb.execute(references?.email)
            .then(() => {
              clearAccessToken()
              clearReferences()
              clearDevice()
              clearRefreshToken()
              clearDr()
              clearSavedAuth()
              clearUType()
              clearuid()
              clearUUID()
              
              router.push('/login')
            })
          }
        })
        break;
        default:
          signoutInProgress.execute(uuid)
          .then((response: AxiosResponse | undefined) => {
            if(response?.data == 'success_destroy'){
              revokeCb.execute(references?.email)
              .then(() => {
                revokeDeviceCb.execute(references?.email)
                .then((rvDevice: AxiosResponse | undefined) => {
                  if(rvDevice?.data == 200) {
                    clearAccessToken()
                    clearReferences()
                    clearDevice()
                    clearRefreshToken()
                    clearDr()
                    clearSavedAuth()
                    clearUType()
                    clearuid()
                    clearUUID()
                    
                    router.push('/login')
                  }
                })
              }).catch((err: AxiosError) => {
                if(err.response?.status == 401) {
                  clearAccessToken()
                  clearReferences()
                  clearDevice()
                  clearRefreshToken()
                  clearDr()
                  clearSavedAuth()
                  clearUType()
                  clearuid()
                  clearUUID()
                  
                  router.push('/login')
                }
              })
            }
          })
          break;
    }
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
  const requestGetNums = () => {
    FetchRequestCb.execute(cookies['deviceId'] && cookies['deviceId'])
    .then((repository: AxiosResponse | undefined) => setRequestNum(repository?.data ?? 0))
  }
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
    const deviceInf: RequestDeviceRecognition = {
      deviceInfoStringify: compressedDeviceInfo,
      isActive: 1,
      createdAt: new Date(),
      email: email,
      deviceId: cookies.deviceId
    }
    
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
        // re-fetch api to get the device id by email - tentative
        deviceCb.execute(deviceInf).then((device: AxiosResponse | undefined) => {
          if(device?.data?.message == "recognized_succeed"){
            setCookie('deviceId', device?.data?.deviceId)
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
          } else if(device?.data == 201) {
            alert("Send verification code on email")
          }
          else {
            deviceRequestCb.execute(email)
            .then((req: AxiosResponse | undefined) => {
              if(req?.data == 200) {
                setDevice("ndd")
                setLoading(false)
                setToBeEncryptedPassword(password)
                  router.push({
                    pathname: '/device/device-new-registration/new-device-registration',
                    query: {
                      email: encrypt(email),
                      password: encrypt(password),
                      isAccess: true
                    }
                  })
              } else if (req?.data == 500) {
                setDevice("ndd")
                setLoading(false)
                setToBeEncryptedPassword(password)
                handleOnToast(
                  "Maximum device request",
                  "top-right",
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  "dark",
                  "error"
                );
                router.push({
                  pathname: '/device/device-new-registration/new-device-registration',
                  query: {
                    email: encrypt(email),
                    password: encrypt(password),
                    isAccess: true
                  }
                })
              }
            })
          }
        })
      }
    })
  };
  /**
   * @deprecated checkAuthentication will remove on release V6
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
        resendRevalidate,
        deviceInfo,
        compressedDeviceInfo,
        requestNum,
        devicePromptApproval,
        toBeEncryptedPassword,
        requestGetNums,
        approveIncomingDevice,
        declineIncomingDevice,
        cookies,
        approvedDeviceTrigger,
        isApprovedDeviceAlive
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
