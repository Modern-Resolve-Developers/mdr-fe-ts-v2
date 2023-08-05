import { ControlledTextField } from "@/components/TextField/TextField";
import { useState, useEffect, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { BottomButtonGroup } from "@/components/ForgotPassword/forms/BottomButtonGroup";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { atom, useAtom } from "jotai";
import { emailAtom } from "@/utils/hooks/useAccountAdditionValues";
import ControlledGrid from "@/components/Grid/Grid";
import { Grid, Typography } from "@mui/material";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import {
  ToastContextContinue,
} from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { useActiveStepContext } from "@/utils/context/base/ActiveStepsContext";
import { EmailAccountCreation, emailBaseSchema } from "@/utils/schema/ForgotPasswordSchema/EmailDetailFromSchema";
import { useActiveSteps } from "@/utils/hooks/useActiveSteps";
import { MAX_FORGOT_FORM_STEPS } from "..";


const EmailForm = () => {
  const { control } = useFormContext<EmailAccountCreation>();

  return (
    <>
      <Typography className="forgot-text">
      Forgot your password?
      </Typography>
      <Typography className="forgot-text-subtitle">
          Please enter the email address associated with your account.
      </Typography>
      <ControlledGrid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            name="email"
            label="Email Address"
            shouldUnregister
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </ControlledGrid>
    </>
  );
};
export const resendBtn = atom(false)
export const useHideResendButton = () => {
  const [resendBtnHide, setResendBtnHide] = useAtom(resendBtn)
  return {
    resendBtnHide,
    setResendBtnHide
  }
}
export const EmailDetailsForm = () => {
  
  const [emailDetailsAtom, setEmailDetailsAtom] = useAtom(emailAtom);
  const [backdrop, setBackdrop] = useState(false);
  const SendVerificationFromEmailProvider = useApiCallBack(
    async (api, email: string) => await api.mdr.sendVerificationFP(email)
  );
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const form = useForm<EmailAccountCreation>({
    resolver: zodResolver(emailBaseSchema),
    mode: "all",
    defaultValues: emailDetailsAtom,
  });
  const useSendVerificationFromEmailProvider = () => {
    return useMutation((email: string) =>
      SendVerificationFromEmailProvider.execute(email)
    );
  };
  const { mutate } = useSendVerificationFromEmailProvider();
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const { next } = useActiveSteps(MAX_FORGOT_FORM_STEPS)
  const { setResendBtnHide } = useHideResendButton()
  const handleContinue = () => {
    handleSubmit(
      (values) => {
        setEmailDetailsAtom(values);
        setBackdrop(!backdrop);
        mutate(values.email, {
          onSuccess: (response: any) => {
            const { data }: any = response;
            console.log(data)
            if (data == "update_fp" || data == "reset" || data == "success") {
              setBackdrop(false);
              handleOnToast(
                "A verification code was sent to your email",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "success"
              );
              next()
            } else if(data == 'max_3') {
              setBackdrop(false);
              handleOnToast(
                "You've reached the maximum request verification code. please use the last sent code.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setResendBtnHide(true)
              next()
            }
          },
          onError: (error) => {
            console.log(error)
            setBackdrop(!backdrop)
            handleOnToast(
              "There's something wrong while requesting the verification code.",
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
        });
      },
      (error) => console.log(error)
    )();
    return false;
  };
  return (
    <FormProvider {...form}>
      <EmailForm />
      <ControlledBackdrop open={backdrop} />
      <BottomButtonGroup continueButtonLabel="Confirm Email"
        disabledContinue={!isValid}
        onContinue={handleContinue}
        hideBack
        max_length={MAX_FORGOT_FORM_STEPS}
      />
    </FormProvider>
  );
};
