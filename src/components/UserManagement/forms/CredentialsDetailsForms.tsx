import { useState, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { BottomButtonGroup } from "./BottomButtonGroup";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { useActiveStep } from "../useActiveStep";
import { useAtom } from "jotai";
import {
  credentialAccountDetailsAtom,
  personalAccountDetailsAtom,
} from "@/utils/hooks/useAccountAdditionValues";
import { ControlledTextField } from "@/components/TextField/TextField";
import { DevTool } from "@hookform/devtools";
import { Container } from "@mui/material";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { UAMAddRequestArgs } from "@/pages/api/users/types";
import { AuthenticationJwtCreateAccount } from "@/pages/api/Authentication/types";
import { useMutation } from "react-query";
import { CredentialsAccountCreation, credentialsBaseSchema } from "@/utils/schema/UserManagement/CredentialsDetailsFormSchema";
import { AxiosResponse } from "axios";


const CredentialDetailsForm = () => {
  const { control } = useFormContext<CredentialsAccountCreation>();

  return (
    <>
      <Container>
        <ControlledTextField
          control={control}
          required
          name="email"
          label="Email"
          shouldUnregister
        />
        <ControlledTextField
          control={control}
          required
          name="password"
          label="Password"
          type="password"
          shouldUnregister
        />
        <ControlledTextField
          control={control}
          required
          name="conpassword"
          label="Confirm Password"
          type="password"
          shouldUnregister
        />
      </Container>
      <DevTool control={control} />
    </>
  );
};

export const CredentialsOwnershipDetailsForm = () => {
  const [credentialsDetailAtom, setCredentialsDetailAtom] = useAtom(
    credentialAccountDetailsAtom
  );
  const [personalDetailsAtom, setPersonalDetailsAtom] = useAtom(
    personalAccountDetailsAtom
  );
  const [open, setOpen] = useState(false);
  const uamcheckemail = useApiCallBack(
    async (api, email: string) => await api.users.UAMCheckEmail(email)
  );
  const uamadduser = useApiCallBack(
    async (api, args: UAMAddRequestArgs) =>
      await api.users.UAMAddUsersFunc(args)
  );
  const authjwtAccountCreation = useApiCallBack(
    async (api, args: AuthenticationJwtCreateAccount) =>
      await api.authentication.authenticationJwtCreateAccount(args)
  );
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const form = useForm<CredentialsAccountCreation>({
    resolver: zodResolver(credentialsBaseSchema),
    mode: "all",
    defaultValues: credentialsDetailAtom,
  });
  const {
    formState: { isValid },
    handleSubmit,
    reset,
  } = form;
  const { next } = useActiveStep();
  const useCheckEmail = () => {
    return useMutation((email: string) =>
      uamcheckemail.execute(email).then((response: AxiosResponse | undefined) => response?.data)
    );
  };
  const useAddNewUser = useMutation((props: UAMAddRequestArgs) =>
    uamadduser.execute(props).then((response: AxiosResponse | undefined) => response?.data)
  );
  const useJwtCreation = useMutation((args: AuthenticationJwtCreateAccount) =>
    authjwtAccountCreation.execute(args).then((response: AxiosResponse | undefined) => response?.data)
  );
  const { mutate } = useCheckEmail();
  const handleContinue = () => {
    setOpen(!open);
    handleSubmit(
      (values) => {
        const uam_add_request_data = {
          firstname: personalDetailsAtom?.firstName,
          lastname: personalDetailsAtom?.lastName,
          middlename: personalDetailsAtom?.hasNoMiddleName
            ? "N/A"
            : personalDetailsAtom?.middleName,
          email: values.email,
          password: values.password,
          userType: personalDetailsAtom?.userType,
          phoneNumber: ''
        };
        mutate(uam_add_request_data.email, {
          onSuccess: (data) => {
            if (data == "email_exist") {
              setOpen(false);
              reset({});
              handleOnToast(
                "This email is already taken.",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              return;
            } else {
              useAddNewUser.mutate(uam_add_request_data, {
                onSuccess: (res) => {
                  if (res == "success") {
                    const jwtobj = {
                      jwtusername: uam_add_request_data.email,
                      jwtpassword: uam_add_request_data.password,
                      isValid: "1",
                    };
                    useJwtCreation.mutate(jwtobj, {
                      onSuccess: (turbo) => {
                        if (turbo?.status === "Success") {
                          handleOnToast(
                            "Successfully added",
                            "top-right",
                            false,
                            true,
                            true,
                            true,
                            undefined,
                            "dark",
                            "success"
                          );
                          setCredentialsDetailAtom(values);
                          next();
                        }
                      },
                      onError: (turboError) => {
                        console.log(turboError);
                      },
                    });
                  }
                },
              });
            }
          },
          onError: (error) => {
            console.log(error);
          },
        });
      },
      (error) => console.log(error)
    )();
    return false;
  };
  return (
    <FormProvider {...form}>
      <CredentialDetailsForm />
      <BottomButtonGroup
        disabledContinue={!isValid}
        onContinue={handleContinue}
      />
      <ControlledBackdrop open={open} />
    </FormProvider>
  );
};