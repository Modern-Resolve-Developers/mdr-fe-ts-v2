import {
  ResponsiveAppBar,
  ControlledButton,
  ControlledBackdrop,
} from "@/components";
import { Card, CardContent, Container, Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { ControlledTextField } from "@/components/TextField/TextField";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { buildHttp } from "./api/http";
import { PrimaryButton, OutlinedButton } from "@/components/Button";

import GoogleButton from "react-google-button";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSetAtom, useAtomValue } from "jotai";
import { accountLoginAtom } from "@/utils/hooks/useAccountAdditionValues";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { ControlledStorage } from "@/utils/storage";

import { ContextSetup } from "@/utils/context";
import {
  ARContext,
  AuthenticationProps,
} from "@/utils/context/base/AdminRegistrationContext";

import { useApiCallBack } from "@/utils/hooks/useApi";
import {
  LoginProps,
  CreateTokenArgs,
  CreateAuthHistoryArgs,
} from "./api/Authentication/types";

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import { useAuthContext } from "@/utils/context/base/AuthContext";

import {
  useAccessToken,
  useReferences,
  useRefreshToken,
  useRouting,
  useUserId,
  useUserType,
} from "@/utils/context/hooks/hooks";

import { useCookies } from "react-cookie";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useMutation, useQuery } from "react-query";
import { GetServerSideProps } from "next";
import { getSecretsIdentifiedAccessLevel } from "@/utils/secrets/secrets_identified_user";
import { PageProps } from "@/utils/types";

const baseSchema = z.object({
  email: requiredString("Your email is required.").email(),
  password: requiredString("Your password is required."),
});

export type loginAccount = z.infer<typeof baseSchema>;
type JWTAuthLoginTypes = {
  jwtusername: string | any;
  jwtpassword: string | any;
};

const Login: React.FC<PageProps> = ({data}) => {
  const {
    getValues,
    control,
    formState: { isValid },
    setValue,
  } = useForm<loginAccount>({
    mode: "all",
    resolver: zodResolver(baseSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [cookies, setCookies] = useCookies(["auth"]);
  const [accessToken, setAccessToken] = useAccessToken();
  const [refreshToken, setRefreshToken] = useRefreshToken();
  const [references, setReferences] = useReferences();
  const [uid, setUid] = useUserId();
  const [userType, setUserType] = useUserType();
  const [dr, setDr] = useRouting();

  const { setAccessSavedAuth, setAccessUserId, accessSavedAuth, accessUserId } =
    useContext(SessionContextMigrate) as SessionStorageContextSetup;
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const setAccountLogin = useSetAtom(accountLoginAtom);
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [preload, setPreLoad] = useState(true)
  /* api callbacks */
  const authSignin = useApiCallBack(async (api, args: LoginProps) => {
    const result = await api.authentication.userAuthLogin(args);
    return result;
  });

  const createtoken = useApiCallBack(async (api, args: CreateTokenArgs) => {
    const result = await api.authentication.createToken(args);
    return result;
  });
  const createAuthHistory = useApiCallBack(
    async (api, args: CreateAuthHistoryArgs) => {
      const result = await api.authentication.createAuthenticationHistory(args);
      return result;
    }
  );
  const jwtAuthLogin = useApiCallBack(
    async (api, args: JWTAuthLoginTypes) =>
      await api.authentication.authenticationJwtLogin(
        args.jwtusername,
        args.jwtpassword
      )
  );
  const IdentifyUsertype = useApiCallBack((api, uuid: any) =>
    api.mdr.IdentifyUserTypeFunc(uuid)
  );
  const googleLoginTms = useApiCallBack((api, email: string) =>
    api.authentication.authenticationGoogleLogin(email)
  );
  const fetchCreatedAuthHistory = useApiCallBack(
    async (api, userId: number | any) =>
      await api.authentication.fetchCreatedAuthHistory(userId)
  );
  const getAuthenticatedRouter = useApiCallBack(
    async (api, requestId: string | undefined) => await api.authentication.authenticatedRouter(requestId))
  useEffect(() => {
    if (Object.keys(user).length > 0) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user?.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res: any) => {
          const { data }: any = res;
        });
    }
  }, [user]);
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      setOpen(!open);
      useGoogleTms.mutate(codeResponse?.email, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data == "not_exist") {
            handleOnToast(
              "Account not Found : No Account Associated with this email.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setOpen(false);
          } else {
            /**
             * Blockers : account creation form for client
             * api response for client login
             */
          }
        },
      });
    },
    onError: (error: any) => console.log("Try failed", error),
  });

  const { checkAuthentication } = useAuthContext();

  useEffect(() => {
    setTimeout(() => {
      if(data?.preloadedAccessLevels == 1) {
        setPreLoad(false)
        router.push('/sys-admin/auth/dashboardauth')
      }
      setPreLoad(false)
    }, 1000)
  }, []);
  const [checkedVal, setCheckedVal] = useState(false);
  const checkRememberMe = () => {
    let parseStorage;
    const storage = localStorage.getItem("rm");
    if (typeof storage == "string") {
      parseStorage = JSON.parse(storage);
    }
    setValue("email", parseStorage?.email);
    setCheckedVal(parseStorage?.rmChecked);
  };
  useEffect(() => {
    checkRememberMe();
  }, []);

  const handleCheckBox = (event: any) => {
    const checked = event.target.checked;
    const value = getValues();
    if (checked) {
      if (!value.email) {
        handleOnToast(
          "Provide required fields",
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
        const objCredentials = {
          email: value.email,
          rmChecked: checked,
        };
        localStorage.setItem("rm", JSON.stringify(objCredentials));
        setCheckedVal(checked);
      }
    } else {
      setCheckedVal(false);
      localStorage.removeItem("rm");
    }
  };
  const useAuthSignIn = () => {
    return useMutation((args: LoginProps) => authSignin.execute(args));
  };
  const useGoogleTms = useMutation((email: string) =>
    googleLoginTms.execute(email)
  );
  const useCreateToken = useMutation((data: { userId: any; token: string }) =>
    createtoken.execute(data)
  );
  const useCreateAuthHistory = useMutation((data: CreateAuthHistoryArgs) =>
    createAuthHistory.execute(data)
  );
  const useJwtAuthLogin = useMutation((data: JWTAuthLoginTypes) =>
    jwtAuthLogin.execute(data)
  );
  const useIdentifyUserType = useMutation((uuid: any) =>
    IdentifyUsertype.execute(uuid)
  );
  const { mutate } = useAuthSignIn();

  const handleSignin = async () => {
    const value = getValues();
    const obj = {
      email: value.email,
      password: value.password,
    };
    setAccountLogin(obj);
    setOpen(!open);
    mutate(obj, {
      onSuccess: (response: any) => {
        if (response.data == "NOT_FOUND") {
          setOpen(false);
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
        } else if (response.data == "INVALID_PASSWORD") {
          setOpen(false);
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
        } else if (response.data == "ACCOUNT_LOCK") {
          setOpen(false);
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
          const objTokenCreation = {
            userId: response.data?.bundle[0]?.id,
            token: "auto-generated-token-backend-side",
          };
          useCreateToken.mutate(objTokenCreation, {
            onSuccess: (res: any) => {
              if (
                res.data?.message == "token-creation-success" ||
                res.data?.message == "token-exist-success"
              ) {
                const savedObj = {
                  firstname: response.data?.bundle[0]?.firstname,
                  lastname: response.data?.bundle[0]?.lastname,
                  email: response.data?.bundle[0]?.email,
                  userId: response.data?.bundle[0]?.Id,
                  token: res.data?.tokenResult[0]?.token,
                };
                const structure = {
                  userId: response.data?.bundle[0]?.id,
                  savedAuth: "auto-generated-backend-area",
                  preserve_data: JSON.stringify(savedObj),
                };
                useCreateAuthHistory.mutate(structure, {
                  onSuccess: (repository: any) => {
                    if (
                      repository?.data == "success-save-auth-history" ||
                      repository?.data == "save-auth-exist"
                    ) {
                      const jwtprops = {
                        jwtusername: obj.email,
                        jwtpassword: obj.password,
                      };
                      useJwtAuthLogin.mutate(jwtprops, {
                        onSuccess: (authLoginResponse: any) => {
                          setDr(response.data?.routeInfo)
                          setReferences(response.data?.bundle[0]);
                          const uuid: string | undefined = JSON.stringify(response.data?.bundle[0]?.id)
                          setUid(uuid);
                          const access_level: string | undefined = JSON.stringify(response.data?.bundle[0]?.userType)
                          setUserType(access_level);
                          setAccessToken(authLoginResponse?.data?.token);
                          setRefreshToken(
                            authLoginResponse?.data?.refreshToken
                          );
                          const expiry = new Date();
                          expiry.setDate(expiry.getDate() + 3);
                          setCookies("auth", authLoginResponse?.data?.token, {
                            path: "/",
                            expires: expiry,
                          });
                          fetchCreatedAuthHistory
                            .execute(structure.userId)
                            .then((savedAuthResponse: any) => {
                              const { data }: any = savedAuthResponse;
                              setAccessSavedAuth(data?.token[0]?.savedAuth);
                              setAccessUserId(structure.userId);
                              setOpen(false);
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
                              if (data?.message == "fetched") {
                                console.log(response.data?.routeInfo)
                                getAuthenticatedRouter.execute(response.data?.routeInfo)
                                .then((auth: any) => {
                                    if(auth.data?.access_level == 1) {
                                      router.push({
                                        pathname: auth.data?.exactPath,
                                        query: { key: response.data?.bundle[0]?.id }
                                      })
                                    }
                                })
                              }
                            });
                        },
                      });
                    }
                  },
                });
              }
            },
          });
        }
      },
    });
  };

  const enterKeyTrigger = (event: any) => {
    const value = getValues();
    if (event.key === "Enter") {
      if (value.password != "") {
        handleSignin();
      }
    }
  };

  return (
    <>
      {preload ? <ControlledBackdrop open={preload} />
      :<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="/drlogo.png"
            alt="Your Company"
            style={{ width: "25%", height: "auto" }}
          />
          <Typography className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </Typography>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/customer-registration"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              start creating your account
            </Link>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <ControlledTextField
                control={control}
                name="email"
                required
                label="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <ControlledTextField
                control={control}
                name="password"
                required
                type="password"
                label="Password"
                onKeyPress={enterKeyTrigger}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                onChange={handleCheckBox}
                checked={checkedVal}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              {/* <a
                
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </a> */}
              <Link
                href={{
                  pathname: "/forgot-password",
                }}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              disabled={!isValid}
              onClick={handleSignin}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockClosedIcon
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true"
                />
              </span>
              Sign in
            </button>
            <GoogleButton
              onClick={() => loginWithGoogle()}
              style={{ width: "100%", marginTop: "20px" }}
            />
          </div>
        </div>
      </div>
    </div>}
      <ControlledBackdrop open={open} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const preloadedAccessLevels = await getSecretsIdentifiedAccessLevel(1)
    return { props : { data: { preloadedAccessLevels }}}
  } catch (error) {
    console.log(`Error on get Notification response: ${JSON.stringify(error)} . `)
    return { props : {error}}
  }
}

export default Login;
