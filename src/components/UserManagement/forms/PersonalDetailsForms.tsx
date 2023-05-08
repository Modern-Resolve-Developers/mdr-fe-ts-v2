import { ControlledTextField } from "@/components/TextField/TextField";
import { Grid } from "@mui/material";
import ControlledTypography from "@/components/Typography/Typography";
import ControlledGrid from "@/components/Grid/Grid";

import { useState, useContext, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { BottomButtonGroup } from "./BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { Typography } from "@mui/material";
import { useActiveStep } from "../useActiveStep";

import { useAtom } from "jotai";
import { personalAccountDetailsAtom } from "@/utils/hooks/useAccountAdditionValues";

import { ControlledSelectField } from "@/components/SelectField";

import { DevTool } from "@hookform/devtools";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { MAX_UAM_STEPS } from "..";

const personalBaseSchema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required."),
  userType: requiredString("Kindly provide user type."),
});

export const personalSchema = z.discriminatedUnion("hasNoMiddleName", [
  z
    .object({
      hasNoMiddleName: z.literal(false),
      middleName: requiredString(
        "Please provide your middlename or select i do not have a middlename."
      ),
    })
    .merge(personalBaseSchema),
  z
    .object({
      hasNoMiddleName: z.literal(true),
      middleName: z.string().optional(),
    })
    .merge(personalBaseSchema),
]);

export type PersonalAccountCreation = z.infer<typeof personalSchema>;

const PersonalDetailsForm = () => {
  const [userType, setUserType] = useState([
    {
      name: "Client Account",
      label: "Client Account",
      value: "3",
    },
    {
      name: "Developer Account",
      label: "Developer Account",
      value: "2",
    },
    {
      name: "Administrator Account",
      label: "Administrator Account",
      value: "1",
    },
  ]);

  const { control, watch, resetField, trigger } =
    useFormContext<PersonalAccountCreation>();

  const hasNoMiddleName = watch("hasNoMiddleName");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);

  useEffect(() => {
    resetField("middleName");
    if (hasNoMiddleNamePrevValue) {
      trigger("middleName");
    }
    resetField("middleName", {
      keepTouched: hasNoMiddleNamePrevValue === true,
    });
  }, [hasNoMiddleName, hasNoMiddleNamePrevValue, resetField, trigger]);
  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            name="firstName"
            label="Firstname"
            shouldUnregister
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required={!hasNoMiddleName}
            name="middleName"
            label="Middlename"
            shouldUnregister
            disabled={hasNoMiddleName}
          />
          <ControlledCheckbox
            control={control}
            name="hasNoMiddleName"
            label="I do not have a middle name"
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            name="lastName"
            label="Lastname"
            shouldUnregister
          />
        </Grid>
      </ControlledGrid>
      <ControlledGrid>
        <Grid item xs={4}>
          <ControlledSelectField
            control={control}
            name="userType"
            options={userType}
            label="User Access Management"
            required
          />
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
      </ControlledGrid>
    </>
  );
};

export const AccountOwnershipDetailsForm = () => {
  const [personalDetailsAtom, setPersonalDetailsAtom] = useAtom(
    personalAccountDetailsAtom
  );

  const form = useForm<PersonalAccountCreation>({
    resolver: zodResolver(personalSchema),
    mode: "all",
    defaultValues: personalDetailsAtom ?? { hasNoMiddleName: false },
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;

  const { next } = useActiveStep();
  const handleContinue = () => {
    handleSubmit(
      (values) => {
        setPersonalDetailsAtom(values);
        next();
      },
      (error) => console.log(error)
    )();
    return false;
  };
  return (
    <FormProvider {...form}>
      <PersonalDetailsForm />
      <BottomButtonGroup
        disabledContinue={!isValid}
        onContinue={handleContinue}
      />
    </FormProvider>
  );
};
