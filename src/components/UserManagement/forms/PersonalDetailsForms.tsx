import { ControlledTextField } from "@/components/TextField/TextField";
import { Grid } from "@mui/material";
import ControlledGrid from "@/components/Grid/Grid";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { BottomButtonGroup } from "./BottomButtonGroup";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";
import { useActiveStep } from "../useActiveStep";
import { useAtom } from "jotai";
import { personalAccountDetailsAtom } from "@/utils/hooks/useAccountAdditionValues";
import { ControlledSelectField } from "@/components/SelectField";
import { PersonalAccountCreation, personalSchema } from "@/utils/schema/UserManagement/PersonalDetailsFormSchema";


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
