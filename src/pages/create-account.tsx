import React, { useState, useEffect, useContext } from "react";
import {
  UncontrolledCard,
  ControlledGrid,
  ControlledBackdrop,
} from "@/components";
import { Container, Typography, Button, Grid } from "@mui/material";
import { ControlledTextField } from "@/components/TextField/TextField";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { accountCreationAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useSetAtom } from "jotai/react";

import { ControlledCheckbox } from "@/components/Checkbox/Checkbox";
import { PasswordStrengthMeter } from "@/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { useRouter } from "next/router";
import { useApiCallBack } from "@/utils/hooks/useApi";
import { UAMCreationAdminArgs } from "./api/users/types";
import { AuthenticationJwtCreateAccount } from "./api/Authentication/types";
import { useMutation } from "react-query";

import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { AccountCreation, schema } from "@/utils/schema/Create-AccountSchema";
import { PageProps } from "@/utils/types";
import { ControlledMobileNumberField } from "@/components/TextField/MobileNumberField";
import { GetServerSideProps } from "next";
import { workWithAccountSetup } from "@/utils/secrets/secrets_migrate_route";

const CreateAccount: React.FC<PageProps> = ({data}) => {
  const [loading, setLoading] = useState(true)
  const UAMCreationOfAccount = useApiCallBack(
    async (api, args: UAMCreationAdminArgs) =>
      await api.users.UAMCreateAdmin(args)
  );
  const jwtAuthAccountCreation = useApiCallBack(
    async (api, args: AuthenticationJwtCreateAccount) =>
      await api.authentication.authenticationJwtCreateAccount(args)
  );
  const setupAccountCheckEmail = useApiCallBack(async (api, email: string) => {
    const result = await api.users.SetupAccountCreationCheckEmail(email);
    return result.data;
  });
  const router = useRouter();
  const { handleOnToast } = useContext(
    ToastContextContinue
  ) as ToastContextSetup;
  const form = useForm<AccountCreation>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      password: "",
      hasNoMiddleName: false,
    },
  });

  const {
    control,
    formState: { isValid, errors },
    watch,
    handleSubmit,
    reset,
    getValues,
    resetField,
    trigger,
  } = form;

  const [open, setOpen] = useState(false);
  const options = {
    dictionary: {
      ...zxcvbnCommonPackage.dictionary,
    },
    graphs: zxcvbnCommonPackage.adjacencyGraphs,
  };
  zxcvbnOptions.setOptions(options);
  const setAccountCreation = useSetAtom(accountCreationAtom);
  const hasNoMiddleName = watch("hasNoMiddleName");
  const passwordWatcher = watch("password");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);
  useEffect(() => {
    if(!data?.preloadedAccountSetup){
      router.push('/')
      setTimeout(() => setLoading(false), 2000)
    }
  }, [data]);

  useEffect(() => {
    resetField("middleName");
    if (hasNoMiddleNamePrevValue) {
      trigger("middleName");
    }
  }, [
    hasNoMiddleName,
    hasNoMiddleNamePrevValue,
    resetField,
    trigger,
    passwordWatcher
  ]);
  const result = zxcvbn(getValues().password == undefined ? "" : getValues().password);
  const useJwtAuthAccountCreation = useMutation(
    (args: AuthenticationJwtCreateAccount) =>
      jwtAuthAccountCreation.execute(args)
  );

  const useCreateAccount = useMutation((data: UAMCreationAdminArgs) =>
    UAMCreationOfAccount.execute(data)
  );

  type CheckEmailMutationArgs = {
    email: string;
    submissionData: UAMCreationAdminArgs;
  };
  const checkUserEmail = () => {
    return useMutation((props: CheckEmailMutationArgs) =>
      setupAccountCheckEmail.execute(props.email)
    );
  };
  const { mutate } = checkUserEmail();
  const handleContinue = () => {
    handleSubmit(
      (values) => {
        setOpen(!open);
        setAccountCreation(values);
        const obj = {
          firstname: values.firstName,
          middlename: values.hasNoMiddleName ? "N/A" : values.middleName,
          lastname: values.lastName,
          email: values.email,
          password: values.password,
          phoneNumber: values.phoneNumber,
        };
        const props = {
          email: obj.email,
          submissionData: obj,
        };
        mutate(props, {
          onSuccess: (logger) => {
            if (logger == "email_exist") {
              setOpen(false);
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
              useCreateAccount.mutate(obj, {
                onSuccess: (logger: any) => {
                  const { data }: any = logger;
                  if (data == "Success") {
                    useJwtAuthAccountCreation.mutate(
                      {
                        jwtusername: obj.email,
                        jwtpassword: obj.password,
                        isValid: "1",
                      },
                      {
                        onSuccess: (response) => {
                          const { data }: any = response;
                          if (data?.status == "Success") {
                            setOpen(false);
                            reset({});
                            handleOnToast(
                              "Successfully Added.",
                              "top-right",
                              false,
                              true,
                              true,
                              true,
                              undefined,
                              "dark",
                              "success"
                            );
                            router.push("/");
                          }
                        },
                        onError: (error) => {
                          setOpen(false);
                          handleOnToast(
                            "Something went wrong.",
                            "top-right",
                            false,
                            true,
                            true,
                            true,
                            undefined,
                            "dark",
                            "success"
                          );
                        },
                      }
                    );
                  }
                },
              });
            }
          },
        });
      }
    )()
    return false
  }

  return (
    <>
      {loading ? <ControlledBackdrop open={loading} /> 
      :
      <Container style={{ marginTop: "100px" }}>
        <UncontrolledCard>
          <Typography variant="h5" mb="2">
            Administrator Information
          </Typography>
          <hr />
          <FormProvider {...form}>
            <ControlledGrid>
              <Grid item xs={4}>
                <ControlledTextField
                  control={control}
                  required
                  name="firstName"
                  label="Firstname"
                  shouldUnregister={true}
                />
              </Grid>
              <Grid item xs={4}>
                <ControlledTextField
                  control={control}
                  disabled={hasNoMiddleName}
                  name="middleName"
                  required={!hasNoMiddleName}
                  label="Middlename"
                  shouldUnregister={true}
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
                  shouldUnregister={true}
                />
              </Grid>
            </ControlledGrid>
            <ControlledGrid>
              <Grid item xs={6}>
              <ControlledTextField
                  control={control}
                  required
                  name="email"
                  label="Email"
                  shouldUnregister={true}
                />
              </Grid>
              <Grid item xs={6}>
                <ControlledMobileNumberField
                  control={control}
                  name='phoneNumber'
                  label="Phone Number"
                  shouldUnregister
                  required
                />
              </Grid>
            </ControlledGrid>
            <ControlledGrid>
              <Grid item xs={6}>
                <ControlledTextField
                  control={control}
                  required
                  name="password"
                  label="Password"
                  shouldUnregister={true}
                  type="password"
                />
                <PasswordStrengthMeter result={result} />
              </Grid>
              <Grid item xs={6}>
                <ControlledTextField
                  control={control}
                  required
                  name="conpassword"
                  label="Confirm Password"
                  shouldUnregister={true}
                  type="password"
                />
              </Grid>
            </ControlledGrid>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleContinue}
              disabled={!isValid}
              style={{
                float: "right",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Submit
            </Button>
          </FormProvider>
        </UncontrolledCard>
        <ControlledBackdrop open={open} />
      </Container>}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  try {
    const preloadedAccountSetup = await workWithAccountSetup()
    return {
      props:{
        data: {
          preloadedAccountSetup
        }
      }
    }
  } catch (error) {
    console.log(`Error on get migration response: ${JSON.stringify(error)}`)
    return { props : {error}}
  }
}

export default CreateAccount;
