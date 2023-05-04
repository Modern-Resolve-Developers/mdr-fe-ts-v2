import { ControlledTextField } from "@/components/TextField/TextField";
import { useContext, useEffect, useState } from "react";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/UserManagement/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import ControlledGrid from "@/components/Grid/Grid";
import { Grid } from "@mui/material";
import { usefpActiveStep } from "../usefpActiveSteps";
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
import { NormalButton } from "@/components/Button/NormalButton";
import { useActiveStep } from "@/components/UserManagement/useActiveStep";
import { MAX_FORGOT_FORM_STEPS } from "..";

const verificationBaseSchema = z.object({
  code: requiredString("Verification code is required"),
});
export type VerificationAccountCreation = z.infer<
  typeof verificationBaseSchema
>;

const VerificationForm = () => {
  const { control } = useFormContext<VerificationAccountCreation>();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            name="code"
            label="Verification Code"
            shouldUnregister
          />
        </Grid>
        <Grid item xs={4}></Grid>
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
  const { mutate } = useCheckVerification();
  const { next, previous } = useActiveStep(MAX_FORGOT_FORM_STEPS);
  const handleContinue = () => {
    handleSubmit((values) => {
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
            // next();
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
    })();
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

      <BottomButtonGroup
        disabledContinue={!isValid}
        onContinue={handleContinue}
        resendBtn
        disableResend={disable}
        onResend={handleResend}
        countdown={countdown}
        previous={previous}
        hideBack
      />
    </FormProvider>
  );
};
