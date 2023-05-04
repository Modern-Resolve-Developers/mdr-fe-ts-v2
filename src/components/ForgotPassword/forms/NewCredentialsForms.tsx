import { ControlledTextField } from "@/components/TextField/TextField";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/UserManagement/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useAtom } from "jotai";
import ControlledGrid from "@/components/Grid/Grid";
import { Grid } from "@mui/material";
import { useActiveStep } from "@/components/UserManagement/useActiveStep";
import { useMutation } from "react-query";
import { useApiCallBack } from "@/utils/hooks/useApi";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { MAX_FORGOT_FORM_STEPS } from "..";

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
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
      </ControlledGrid>
    </>
  );
};
