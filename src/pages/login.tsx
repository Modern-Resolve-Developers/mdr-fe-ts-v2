import { ResponsiveAppBar, ControlledButton, ControlledBackdrop } from "@/components";
import { Card, CardContent, Container, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { ControlledTextField } from "@/components/TextField/TextField";
import { FieldValues, useForm  } from "react-hook-form";
import {z} from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { buildHttp } from "./api/http";
import { PrimaryButton, OutlinedButton } from "@/components/Button";

import GoogleButton from 'react-google-button'

import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useRouter } from 'next/router';

import { useSetAtom, useAtomValue } from "jotai";
import { accountLoginAtom } from "@/utils/hooks/useAccountAdditionValues";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";


import { ControlledStorage } from "@/utils/storage";

import { ContextSetup } from "@/utils/context";
import {ARContext, AuthenticationProps} from "@/utils/context/base/AdminRegistrationContext"

import { useApiCallBack } from "@/utils/hooks/useApi";
import { LoginProps, CreateTokenArgs, CreateAuthHistoryArgs } from "./api/Authentication/types";

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";

import { useAccessToken, useRefreshToken } from "@/utils/context/hooks/hooks";
import { useLayout } from "../utils/pageHooks/hooks/useLayout";

import { useCookies } from 'react-cookie'


const baseSchema = z.object({
    email : requiredString("Your email is required.").email(),
    password: requiredString("Your password is required.")
})

export type loginAccount = z.infer<typeof baseSchema>
type JWTAuthLoginTypes = {
  jwtusername: string | any
  jwtpassword: string | any

}
const Login: React.FC = () => {
    const {
        getValues,
        control,
        formState : { isValid },
        setValue
    } = useForm<loginAccount>({
        mode: "all",
        resolver: zodResolver(baseSchema),
        defaultValues : {
            email: '',
            password: ''
        }
    })
    const [cookies, setCookies] = useCookies(['auth'])
    const [accessToken, setAccessToken] = useAccessToken()
    const [refreshToken, setRefreshToken] = useRefreshToken()
    const {
      setAccessSavedAuth, setAccessUserId, accessSavedAuth, accessUserId
    } = useContext(SessionContextMigrate) as SessionStorageContextSetup
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const { 
      CheckAuthentication
    } = useContext(ARContext) as ContextSetup
    const setAccountLogin = useSetAtom(accountLoginAtom)
    const router = useRouter()
    const [user, setUser] = useState<any>({})
    const [profile, setProfile] = useState([])
    const [open, setOpen] = useState(false)

    /* api callbacks */
    const authSignin = useApiCallBack(async (api, args: LoginProps) => {
      const result = await api.authentication.userAuthLogin(args)
      return result
    })
    const createtoken = useApiCallBack(async (api, args: CreateTokenArgs) => {
      const result = await api.authentication.createToken(args)
      return result
    })
    const createAuthHistory = useApiCallBack(async (api, args : CreateAuthHistoryArgs) => {
      const result = await api.authentication.createAuthenticationHistory(args)
      return result
    })
    const jwtAuthLogin = useApiCallBack(async (api, args : JWTAuthLoginTypes) => await api.authentication.authenticationJwtLogin(args.jwtusername, args.jwtpassword))
    const IdentifyUsertype = useApiCallBack((api, uuid: any) => api.mdr.IdentifyUserTypeFunc(uuid))
    const fetchCreatedAuthHistory = useApiCallBack((api, userId: number | any) => api.authentication.fetchCreatedAuthHistory(userId))
    const FetchAuthentication = useApiCallBack(async (api, args: AuthenticationProps) => {
      const result = await api.authentication.userAvailabilityCheck(args)
      return result
    })
    const loginWithGoogle = useGoogleLogin({
        onSuccess: (codeResponse : any) => setUser(codeResponse),
        onError: (error : any) => console.log("Try failed", error)
    })

    
    
    useEffect(
      () => {
        setOpen(!open)
        let savedAuthStorage;
        const savedTokenStorage = localStorage.getItem('token')
        if(typeof savedTokenStorage == 'string'){
            savedAuthStorage = JSON.parse(savedTokenStorage)
        }
        const uuid = localStorage.getItem('uid') === null ? 0 : localStorage.getItem('uid')
        if(savedAuthStorage == undefined && uuid == 0) {
          setOpen(false)
          return;
        } else {
            /* if the token is not valid or neither expired -> fetching API to get the user data breakdown will prohibited.  */
            FetchAuthentication.execute({
              userId : uuid == null ? 0 : uuid,
              savedAuth: savedAuthStorage == null ? null : savedAuthStorage
            }).then((res : any) => {
              if(res == 'no_saved_storage') {
                  setOpen(false)
                }
                else if(res?.data == 'no_records'){
                  setOpen(false)
                } else if(res?.data == 'not_match'){
                  setOpen(false)
                } else {
                  IdentifyUsertype.execute(uuid)
                  .then((identified: any) => {
                    if(identified?.data == 'Administrator') {
                      setOpen(false)
                      router.push('/sys-admin/admin-dashboard')
                    } else if(identified?.data == 'Developers') {
                      setOpen(false)
                      router.push('/sys-dev/dev-dashboard')
                    }
                  }).catch(error => {
                    setOpen(false)
                    return;
                  })
                }
          }).catch(error => {
            setOpen(false)
            return;
          })
        }
        
      },
      [accessSavedAuth, accessUserId]
    )
    
    const handleSignin = async () => {
        const value = getValues()
        const obj = {
            email : value.email,
            password : value.password
        }
        setAccountLogin(obj)
        setOpen(!open)
        const params = authSignin.execute(obj)
        params.then(res => {
          const { data } : any = res;
          if(data == 'NOT_FOUND') {
            setOpen(false)
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
            )
        } else if(data == 'INVALID_PASSWORD'){
            setOpen(false)
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
            )
        } else if(data == 'ACCOUNT_LOCK') {
          setOpen(false)
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
            )
        }else {
            const objTokenCreation = {
              userId: data?.bundle[0]?.id,
              token: "auto-generated-token-backend-side"
            }
            createtoken.execute(objTokenCreation)
            .then((res : any) => {
              if(res.data?.message == 'token-creation-success' || res.data?.message == 'token-exist-success'){
                const savedObj = {
                  firstname : data?.bundle[0]?.firstname,
                  lastname : data?.bundle[0]?.lastname,
                  email : data?.bundle[0]?.email,
                  userId : data?.bundle[0]?.Id,
                  token: res.data?.tokenResult[0]?.token
                }
                const structure = {
                  userId : data?.bundle[0]?.id,
                  savedAuth: "auto-generated-backend-area",
                  preserve_data : JSON.stringify(savedObj)
                }
                createAuthHistory.execute(structure)
                .then((repository : any) => {
                  if(repository?.data == 'success-save-auth-history' || repository?.data == 'save-auth-exist'){
                    fetchCreatedAuthHistory.execute(structure.userId)
                    .then((api : any) => {
                      const jwtprops = {
                        jwtusername : obj.email,
                        jwtpassword : obj.password
                      }
                      jwtAuthLogin.execute(jwtprops)
                      .then((authLoginResponse : any) => {
                        setAccessToken(
                          authLoginResponse?.data?.token
                        )
                        setRefreshToken(
                          authLoginResponse?.data?.refreshToken
                        )
                        const expiry = new Date()
                        expiry.setDate(expiry.getDate() + 3)
                        setCookies('auth', authLoginResponse?.data?.token, {
                          path: '/',
                          expires: expiry
                        })
                        setAccessSavedAuth(api?.data?.token[0]?.savedAuth)
                        setAccessUserId(structure.userId)
                        setOpen(false)
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
                        )
                        if(api?.data?.message == 'fetched'){
                          IdentifyUsertype.execute(structure.userId)
                          .then((identified: any) => {
                            if(identified?.data == 'Administrator') {
                              router.push('/sys-admin/admin-dashboard')
                            } else if(identified?.data == 'Developers') {
                              router.push('/sys-dev/dev-dashboard')
                            }
                          })
                        }
                      })
                    }).catch(error => {
                      return;
                    })
                  }
                })
              }
            })
        }
        })
    }

    const enterKeyTrigger = (event: any) => {
      const value = getValues()
      if(event.key === "Enter") {
        if(value.password != '') {
          handleSignin()
        }
      }
    }

    return (
        <>
        {
          useLayout(
            {
              control: control,
              isValid: isValid,
              handleSubmit: handleSignin,
              enterKeyLogin: enterKeyTrigger,
              getValues: getValues,
              setValue: setValue
            },
            ['AccountLoginBlocks']
          )
        }
      <ControlledBackdrop open={open} />
        </>
    )
}

export default Login