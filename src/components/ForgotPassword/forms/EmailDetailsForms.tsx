import { ControlledTextField } from "@/components/TextField/TextField";
import { useState, useEffect, useContext } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/UserManagement/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import { emailAtom } from "@/utils/hooks/useAccountAdditionValues";
import ControlledGrid from "@/components/Grid/Grid";
import { Grid } from "@mui/material";
import { usefpActiveStep } from "../usefpActiveSteps";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import {
  ToastContextContinue,
  useToastContext,
} from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { useActiveStep } from "@/components/UserManagement/useActiveStep";
import { MAX_FORGOT_FORM_STEPS } from "..";

const emailBaseSchema = z.object({
  email: requiredString("Email is required").email(),
});
export type EmailAccountCreation = z.infer<typeof emailBaseSchema>;

const EmailForm = () => {
  const { control } = useFormContext<EmailAccountCreation>();

  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            name="email"
            label="Email"
            shouldUnregister
          />
        </Grid>
        <Grid item xs={4}></Grid>
      </ControlledGrid>
    </>
  );
};

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
  const { next, previous } = useActiveStep(MAX_FORGOT_FORM_STEPS);
  const handleContinue = () => {
    handleSubmit(
      (values) => {
        setEmailDetailsAtom(values);
        setBackdrop(!backdrop);
        mutate(values.email, {
          onSuccess: (response: any) => {
            const { data }: any = response;
            if (data == "update_fp" || data == "reset" || data == "success") {
              setBackdrop(false);
              next();
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
            }
          },
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
      <BottomButtonGroup
        disabledContinue={!isValid}
        onContinue={handleContinue}
        hideBack
        previous={previous}
      />
    </FormProvider>
  );
};
