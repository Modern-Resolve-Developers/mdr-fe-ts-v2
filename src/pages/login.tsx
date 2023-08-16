import {
  ControlledBackdrop,
} from "@/components";
import { Typography } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { ControlledTextField } from "@/components/TextField/TextField";
import { zodResolver } from "@hookform/resolvers/zod";

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
  LoginProps
} from './api/Authentication/types';
import {
  useAccessToken,
  useDevice,
  useGoogleAccountInfo,
  useReferences,
  useRefreshToken,
  useRouting,
  useUserId,
  useUserType,
} from '@/utils/context/hooks/hooks';

import { useCookies } from 'react-cookie';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery } from 'react-query';
import { loginAccount, LoginSchema } from '@/utils/schema/LoginSchema';
import { useLoaders } from '@/utils/context/base/LoadingContext';
import { decrypt, encrypt } from '@/utils/secrets/hashed';
import { useAuthContext } from '@/utils/context/base/AuthContext';
import { useForm } from "react-hook-form";

const Login: React.FC = () => {
  const {
    getValues,
    control,
    formState: { isValid },
    setValue,
  } = useForm<loginAccount>({
    mode: 'all',
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [uid, setUid] = useUserId();
  const [googleAccountInfo, setGoogleAccountInfo] = useGoogleAccountInfo();
  const [dr, setDr] = useRouting();
  const { loading, setLoading, preload, setPreLoad } = useLoaders()
  const { handleOnToast } = useContext(
    ToastContextContinue,
  ) as ToastContextSetup;
  const setAccountLogin = useSetAtom(accountLoginAtom);
  const router = useRouter();
  const [user, setUser] = useState<any>({});
  const [device, setDevice] = useDevice()
  const [references, setReferences] = useReferences()
  const { toBeEncryptedPassword } = useAuthContext()
  /* api callbacks */
  const authSignin = useApiCallBack(async (api, args: LoginProps) => {
    const result = await api.authentication.userAuthLogin(args);
    return result;
  });
  const foundSecuredRouter = useSecureHiddenNetworkApi(
    async (api, id: string | undefined) =>
      await api.secure.sla_begin_work_find_secured_route(id),
  );
  const googleCheckAccounts = useApiCallBack(
    async (api, email: string) => await api.users.GoogleCheckAccounts(email),
  );
  const loginWithGoogle = useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      setLoading(!loading);
      axios
        .get(
          `${process.env.NEXT_PUBLIC_GOOGLE_AUTH}/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
              Accept: 'application/json',
            },
          },
        )
        .then((res: any) => {
          const { data }: any = res;
          googleCheckAccounts
            .execute(data.email)
            .then((res: AxiosResponse | undefined) => {
              if (res?.data == 501) {
                handleOnToast(
                  'There is no customer account associated with this email.',
                  'top-right',
                  false,
                  true,
                  true,
                  true,
                  undefined,
                  'dark',
                  'error',
                );
                setLoading(false);
              } else if (res?.data == 201) {
                setLoading(false);
                router.push({
                  pathname: '/customer-registration',
                  query: {
                    email: data.email,
                    firstname: data.given_name,
                    lastname: data.family_name,
                  },
                });
                setGoogleAccountInfo(data);
              } else {
                const foundKey = decrypt(res?.data);
                login(data.email, foundKey);
              }
            });
        });
    },
    onError: (error: any) => console.log('Try failed', error),
  });
  const useFoundSecuredRouter = useMutation((id: string | undefined) =>
    foundSecuredRouter.execute(id),
  );
  useEffect(() => {
    setLoading(false)
    if(device != undefined) {
      router.push({
        pathname: '/device/device-new-registration/new-device-registration',
        query: {
          email: encrypt(references?.email ?? ""),
          password: encrypt(toBeEncryptedPassword ?? "")
        }
      })
    } else {
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
    }
  }, []);
  const [checkedVal, setCheckedVal] = useState(false);
  const checkRememberMe = () => {
    let parseStorage;
    const storage = localStorage.getItem('rm');
    if (typeof storage == 'string') {
      parseStorage = JSON.parse(storage);
    }
    setValue('email', parseStorage?.email);
    setCheckedVal(parseStorage?.rmChecked);
  };
  useEffect(() => {
    checkRememberMe();
    deviceInfo()
  }, []);

  const handleCheckBox = (event: any) => {
    const checked = event.target.checked;
    const value = getValues();
    if (checked) {
      if (!value.email) {
        handleOnToast(
          'Provide required fields',
          'top-right',
          false,
          true,
          true,
          true,
          undefined,
          'dark',
          'error',
        );
      } else {
        const objCredentials = {
          email: value.email,
          rmChecked: checked,
        };
        localStorage.setItem('rm', JSON.stringify(objCredentials));
        setCheckedVal(checked);
      }
    } else {
      setCheckedVal(false);
      localStorage.removeItem('rm');
    }
  };
  const { login, deviceInfo } = useAuthContext();

  const handleSignin = async () => {
    const value = getValues();
    const obj = {
      email: value.email,
      password: value.password,
    };
    setAccountLogin(obj);
    setLoading(!loading);
    login(obj.email, obj.password);
  };

  const enterKeyTrigger = (event: any) => {
    const value = getValues();
    if (event.key === 'Enter') {
      if (value.password != '') {
        handleSignin();
      }
    }
  };

  return (
    <>
      {preload ? (
        <ControlledBackdrop open={preload} />
      ) : (
        <div className="min-h-screen  top-0 left-0 bg-gradient-to-t from-[#b7497e]   to-[#f7d48c]">
          <div className="w-full lg:max-w-screen space-y-8">
            <div className=" container mx-auto py-24 sm:py-20 md:py-20 lg:py-[4rem]">
              <div className=" flex justify-center items-center ">
                <div className="bg-white  h-[400px] lg:h-[710px] lg:w-[683px] shadow-l-lg lg:rounded-l-md  overflow-hidden   hidden  sm:hidden md:hidden lg:block">
                  <img
                    src="/clienttheme.png"
                    alt="theme"
                    className=" h-full w-full object-cover p-4 fade-in  "
                  />
                </div>
                <div className=" bg-white px-[60px] lg:px-[90px] py-10  md:py-12 lg:py-20   h-[650px] md:h-[680px] lg:h-[710px] lg:rounded-r-lg w-[450px]  md:w-[400px] lg:w-[693px]  shadow-r-lg">
                  <img
                    src="/mdr-updated-logo.png"
                    alt="logooo"
                    className=" h-12 w-12 object-cover relative lg:-left-2 p-2  "
                  />
                  <Typography className="mt-4 text-left text-2xl font-bold tracking-tight text-gray-900 ">
                    Sign in
                  </Typography>
                  <p className="mt-2 text-left  text-sm text-[#808080]">
                    Welcome back! Please enter your details
                  </p>

                  <div className="mt-6 space-y-6">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="-space-y-px rounded-md shadow-sm">
                      <div className="py-2">
                        <label
                          htmlFor="label"
                          className="text-[#808080] text-[15px]  ">
                          Email
                        </label>
                      </div>
                      <ControlledTextField
                        control={control}
                        name="email"
                        required
                      />

                      <div className="py-2">
                        <label
                          htmlFor="label"
                          className="text-[#808080] text-[15px] ">
                          Password
                        </label>
                      </div>
                      <ControlledTextField
                        control={control}
                        name="password"
                        required
                        type="password"
                        onKeyPress={enterKeyTrigger}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded-sm text-[#8B255B] focus:ring-[#8b255bc8]"
                          onChange={handleCheckBox}
                          checked={checkedVal}
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-[13px] text-gray-900">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <Link
                          href={{
                            pathname: '/forgot-password',
                          }}
                          className="font-medium text-[#8B255B] text-[13px] hover:text-[#5e2855]">
                          Forgot Password?
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                        disabled={!isValid}
                        onClick={handleSignin}
                        className="group relative flex w-full px-6 mt-5 justify-center rounded-md border border-transparent bg-[#8B255B] py-2 text-sm font-medium text-white hover:bg-[#e152a8] focus:outline-none focus:ring-2 focus:ring-[#8B255B] cus:ring-offset-2">
                        Sign in
                      </button>
                      <GoogleButton
                        className="rounded-md"
                        onClick={() => loginWithGoogle()}
                        style={{ width: '100%', marginTop: '10px' }}
                      />
                      <p className="mt-6 text-center  text-sm text-gray-600 ">
                        Don't have an account?
                        <Link
                          href="/customer-registration"
                          className="font-medium ml-1 text-[#8B255B] hover:text-[#8B255B]">
                          Signup
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ControlledBackdrop open={loading} />
    </>
  );
};

export default Login;
