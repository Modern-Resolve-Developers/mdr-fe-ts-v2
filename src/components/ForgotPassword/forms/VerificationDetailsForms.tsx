import { ControlledTextField } from "@/components/TextField/TextField";
import { useContext, useEffect, useState } from "react";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/ForgotPassword/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import ControlledGrid from "@/components/Grid/Grid";
import { Button, Grid } from "@mui/material";

import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import {
  fpIdAtom,
  verificationAtom,
} from "@/utils/hooks/useAccountAdditionValues";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { emailAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useHideResendButton } from ".";
import { VerificationAccountCreation, verificationBaseSchema } from "@/utils/schema/ForgotPasswordSchema/VerificationDeatilsFormSchema";
import { useActiveSteps } from "@/utils/hooks/useActiveSteps";
import { MAX_FORGOT_FORM_STEPS } from "..";
import { Box } from "@mui/material";
import { useScreenSize } from "@/utils/hooks/useScreenSize";



const VerificationForm = () => {
  const { control } = useFormContext<VerificationAccountCreation>();
  const { windowSize } = useScreenSize();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={windowSize.width > 600 ? 4 : 0}></Grid>
        <Grid item xs={windowSize.width > 600 ? 4 : 12}>
          <ControlledTextField
            control={control}
            required
            name="code"
            label="Verification Code"
            shouldUnregister
          />
        </Grid>
        <Grid item xs={windowSize.width > 600 ? 4 : 0}></Grid>
      </ControlledGrid>
    </>
  );
};

export const VerificationDetailsForm = () => {
  const [verifyAtom, setVerifyAtom] = useAtom(verificationAtom);
  const [emailDetailsAtom, setEmailDetailsAtom] = useAtom(emailAtom);
  const [backdrop, setBackdrop] = useState(false);
  const [disable, setDisable] = useState(false);
  const [countdown, setCountDown] = useState(60);
  const [fpidatom, setFpIdAtom] = useAtom(fpIdAtom);
  const checkVerificationCode = useApiCallBack(
    async (api, args: { email: string | undefined; code: string }) =>
      await api.mdr.checkVerification(args)
  );
  const resendVerificationCode = useApiCallBack(
    async (api, email: string | undefined) =>
      await api.mdr.resendVerification(email)
  );
  const form = useForm<VerificationAccountCreation>({
    resolver: zodResolver(verificationBaseSchema),
    mode: "all",
    defaultValues: verifyAtom,
  });
  useEffect(() => {
    if (disable) {
      const intervalId = setInterval(() => {
        setCountDown((prevCountDown: any) => prevCountDown - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setCountDown(60);
    }
  }, [disable]);
  useEffect(() => {
    if (countdown === 0) {
      setDisable(false);
    }
  }, [countdown]);
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const useCheckVerification = () => {
    return useMutation((props: { email: string | undefined; code: string }) =>
      checkVerificationCode.execute(props)
    );
  };
  const useResendVerification = useMutation((email: string | undefined) =>
    resendVerificationCode.execute(email)
  );
  const { resendBtnHide } = useHideResendButton()
  const { mutate } = useCheckVerification();
  const { next } = useActiveSteps(MAX_FORGOT_FORM_STEPS)
  useEffect(() => {
    console.log(resendBtnHide)
  }, [])
  const handleContinue = () => {
    handleSubmit(
      (values) => {
        
        setVerifyAtom(values);
      setBackdrop(!backdrop);
      const obj = {
        email: emailDetailsAtom?.email,
        code: values.code,
      };
      mutate(obj, {
        onSuccess: (response: any) => {
          const { data }: any = response;
          if (data?.message == "verified") {
            setFpIdAtom(data?.bundleData?.id);
            handleOnToast(
              "Your code is verified ! You can now change your password",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "success"
            );
            setBackdrop(false);
            next()
          } else if (data == "expired") {
            handleOnToast(
              "The verification code is already expired. Kindly click re-send",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setBackdrop(false);
          } else if (data == "max_3") {
            handleOnToast(
              "You've reached the maximum verification request. Kindly use the last code.",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setBackdrop(false);
            setDisable(!disable);
          } else if (data == "invalid_code") {
            handleOnToast(
              "Invalid verification code",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setBackdrop(false);
          }
        },
        onError: (error) => {
          console.log(error);
        },
      });
      }
    )();
    return false;
  };
  const handleResend = () => {
    setBackdrop(!backdrop);
    useResendVerification.mutate(emailDetailsAtom?.email, {
      onSuccess: (response: any) => {
        const { data }: any = response;
        if (data == "resend_success") {
          setDisable(!disable);
          setBackdrop(false);
          handleOnToast(
            "Successfully resend verification code.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
        } else if (data == "max_3") {
          setBackdrop(false);
          handleOnToast(
            "You've reached the maximum verification request. Kindly use the last code.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
        } else if (data == "invalid_resend") {
          setBackdrop(false);
          handleOnToast(
            "Invalid Verification Code.",
            "top-right",
            false,
            true,
            true,
            true,
            undefined,
            "dark",
            "success"
          );
        }
      },
    });
    return false;
  };
  return (
    <FormProvider {...form}>
      <VerificationForm />
      <ControlledBackdrop open={backdrop} />
      <BottomButtonGroup max_length={MAX_FORGOT_FORM_STEPS} resendBtn onresend={handleResend} countdown={countdown} disableBtn={disable} hideBack onContinue={handleContinue} />
    </FormProvider>
  );
};
