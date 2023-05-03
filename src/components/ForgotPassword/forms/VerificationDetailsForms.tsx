import { ControlledTextField } from "@/components/TextField/TextField";
import { useState } from "react";
import { z } from "zod";
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
import { verificationAtom } from "@/utils/hooks/useAccountAdditionValues";

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
  const [backdrop, setBackdrop] = useState(false);

  const form = useForm<VerificationAccountCreation>({
    resolver: zodResolver(verificationBaseSchema),
    mode: "all",
    defaultValues: verifyAtom,
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const { next } = usefpActiveStep();
  const handleContinue = () => {
    handleSubmit((values) => {})();
    return false;
  };
  return (
    <FormProvider {...form}>
      <VerificationForm />
      <ControlledBackdrop open={backdrop} />
      <BottomButtonGroup
        disabledContinue={!isValid}
        onContinue={handleContinue}
      />
    </FormProvider>
  );
};
