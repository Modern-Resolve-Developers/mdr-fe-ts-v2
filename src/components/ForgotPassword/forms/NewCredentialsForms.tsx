import { ControlledTextField } from "@/components/TextField/TextField";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/ForgotPassword/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import ControlledGrid from "@/components/Grid/Grid";
import { Grid } from "@mui/material";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { newCredentialsAtom } from "@/utils/hooks/useAccountAdditionValues";

import { verificationAtom } from "@/utils/hooks/useAccountAdditionValues";
import { emailAtom } from "@/utils/hooks/useAccountAdditionValues";
import { FPChangePasswordProps } from "@/pages/api/types";
import { MAX_FORGOT_FORM_STEPS } from "..";
import { useActiveSteps } from "@/utils/hooks/useActiveSteps";

const newCredentialsBaseSchema = z
  .object({
    password: requiredString("Your password is required."),
    conpass: requiredString("Kindly confirm your password."),
  })
  .refine(
    ({ conpass, password }) => {
      return password === conpass;
    },
    { path: ["conpass"], message: "Password is not match" }
  );

export type NewCredentialsAccountCreation = z.infer<
  typeof newCredentialsBaseSchema
>;

const NewCredentialsForm = () => {
  const { control } = useFormContext<NewCredentialsAccountCreation>();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField 
            control={control}
            required
            name="password"
            type="password"
            label="New Password"
            shouldUnregister
          />
        </Grid>
        <Grid item xs={6}>
        <ControlledTextField 
            control={control}
            required
            name="conpass"
            type="password"
            label="Confirm Password"
            shouldUnregister
          />
        </Grid>
      </ControlledGrid>
    </>
  );
};

export const NewCredentialsDetailsForm = () => {
  const [credentials, setCredentials] = useAtom(newCredentialsAtom)
  const [verifyAtom, setVerifyAtom] = useAtom(verificationAtom);
  const [emailDetailsAtom, setEmailDetailsAtom] = useAtom(emailAtom);
  const changePassword = useApiCallBack(async (api, args : FPChangePasswordProps) => await api.mdr.changePassword(args))
  const [open, setOpen] = useState(false)
  const form = useForm<NewCredentialsAccountCreation>({
    resolver: zodResolver(newCredentialsBaseSchema),
    mode: 'all',
    defaultValues : credentials
  })
  const { next } = useActiveSteps(MAX_FORGOT_FORM_STEPS)
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const useChangePassword = () => {
    return useMutation((props : FPChangePasswordProps) => changePassword.execute(props))
  }
  const { mutate } = useChangePassword()
  const handleContinue = () => {
    handleSubmit(
      (values) => {
        const obj = {
          email: emailDetailsAtom?.email,
          newPassword: values.password,
          currentVerificationCode: verifyAtom?.code
        }
        setOpen(!open)
        mutate(obj, {
          onSuccess: (response: any) => {
            const { data } : any = response;
            if(data == 'succeeded'){
              setOpen(false)
              handleOnToast(
                "You have successfully updated your password!",
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
            }
          }
        })
      }
    )()
    return false;
  }
  return (
    <FormProvider {...form}>
      <NewCredentialsForm />
      <ControlledBackdrop open={open} />
      <BottomButtonGroup 
      disabledContinue={!isValid}
      onContinue={handleContinue}
      hideBack
      max_length={MAX_FORGOT_FORM_STEPS}
      />
    </FormProvider>
  )
}