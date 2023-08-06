import {
  ResponsiveAppBar,
  ControlledButton,
  ControlledBackdrop,
} from "@/components";
import { Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { ControlledTextField } from "@/components/TextField/TextField";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";

import GoogleButton from "react-google-button";

import { useGoogleLogin } from "@react-oauth/google";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSetAtom, useAtomValue } from "jotai";
import { accountLoginAtom } from "@/utils/hooks/useAccountAdditionValues";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { useApiCallBack, useSecureHiddenNetworkApi } from "@/utils/hooks/useApi";
import {
  LoginProps,
  CreateTokenArgs,
  CreateAuthHistoryArgs,
} from "./api/Authentication/types";

import { SessionContextMigrate } from "@/utils/context/base/SessionContext";
import { SessionStorageContextSetup } from "@/utils/context";
import {
  useAccessToken,
  useGoogleAccountInfo,
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
import { loginAccount, LoginSchema } from "@/utils/schema/LoginSchema";
import { useLoaders } from "@/utils/context/base/LoadingContext";
import { decrypt } from "@/utils/secrets/hashed";
import { useAuthContext } from "@/utils/context/base/AuthContext";
type JWTAuthLoginTypes = {
  jwtusername: string | any;
  jwtpassword: string | any;
};

const Login: React.FC = () => {
  const {
    getValues,
    control,
    formState: { isValid },
    setValue,
  } = useForm<loginAccount>({
    mode: "all",
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [uid, setUid] = useUserId();
  const [userType, setUserType] = useUserType();
  const [googleAccountInfo, setGoogleAccountInfo] = useGoogleAccountInfo()
  const [dr, setDr] = useRouting();
  const { loading, setLoading, preload, setPreLoad } = useLoaders()
  const { setAccessSavedAuth, setAccessUserId, accessSavedAuth, accessUserId } =
    useContext(SessionContextMigrate) as SessionStorageContextSetup;
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const setAccountLogin = useSetAtom(accountLoginAtom);
  const router = useRouter();
  const [user, setUser] = useState<any>({});
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
  const foundSecuredRouter = useSecureHiddenNetworkApi(
    async (api, id: string | undefined) => await api.secure.sla_begin_work_find_secured_route(id)
  )
  const googleCheckAccounts = useApiCallBack(
    async (api, email: string) => await api.users.GoogleCheckAccounts(email)
  );
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      setLoading(!loading)
      axios
        .get(
          `${process.env.NEXT_PUBLIC_GOOGLE_AUTH}/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res: any) => {
          const { data }: any = res;
          googleCheckAccounts.execute(data.email)
          .then((res: AxiosResponse | undefined) => {
            if(res?.data == 501) {
              handleOnToast(
                "There is no customer account associated with this email.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setLoading(false)
            } else if(res?.data == 201) {
              setLoading(false)
              router.push({
                pathname: '/customer-registration',
                query: {
                  email : data.email,
                  firstname: data.given_name,
                  lastname: data.family_name
                }
              })
              setGoogleAccountInfo(data)
            } else {
              const foundKey = decrypt(res?.data)
              login(data.email, foundKey)
            }
          })
        });
    },
    onError: (error: any) => console.log("Try failed", error),
  });
  const useFoundSecuredRouter = useMutation((id: string | undefined) => 
    foundSecuredRouter.execute(id)
  );
  useEffect(() => {
    if(uid != undefined) {
      useFoundSecuredRouter.mutate(uid ?? "0", {
        onSuccess: (response: AxiosResponse | undefined) => {
          if(response?.data != 404){
            router.replace(response?.data)
            setTimeout(() => setPreLoad(false), 2000)
          }
        },
        onError: (error: AxiosError | unknown) => {
          setPreLoad(false)
        }
      })
    } else {
      setPreLoad(false)
    }
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
  const { login } = useAuthContext();

  const handleSignin = async () => {
    const value = getValues();
    const obj = {
      email: value.email,
      password: value.password,
    };
    setAccountLogin(obj);
    setLoading(!loading);
    login(obj.email, obj.password)
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
      <ControlledBackdrop open={loading} />
    </>
  );
};


export default Login;
 