import {
  Container,
  Box,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import HomeFooterSection from "../Content/Home/FooterSection";
import { NormalButton } from "../Button/NormalButton";
import { CSSProperties, useEffect, useState } from "react";
import { useRouter } from "next/router";
import UncontrolledCard from "../Cards/Card";
import ControlledGrid from "../Grid/Grid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { ControlledTextField } from "../TextField/TextField";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { useAtom } from "jotai";
import { ControlledCheckbox } from "../Checkbox/Checkbox";
import GoogleButton from "react-google-button";

import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommonPackage from "@zxcvbn-ts/language-common";
import { useApiCallBack, useSecureHiddenNetworkApi } from "@/utils/hooks/useApi";
import { useMutation } from "react-query";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { PasswordStrengthMeter } from "../PasswordStrengthMeter/PasswordStrengthMeter";
import { LockClosedIcon } from "@heroicons/react/20/solid";

import {
  accountClientCreationAtom,
  ClientCreationAtom,
} from "@/utils/hooks/useAccountAdditionValues";
import { UAMAddRequestArgs } from "@/pages/api/users/types";
import ControlledBackdrop from "../Backdrop/Backdrop";
import { ControlledMobileNumberField } from "../TextField/MobileNumberField";
import { useToastContext } from "@/utils/context/base/ToastContext";
import { AuthenticationJwtCreateAccount, VerificationProps } from "@/pages/api/Authentication/types";
import { AxiosResponse } from "axios";
const clientRegistrationBaseSchema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required"),
  email: requiredString("Your email is required.").email(),
  phoneNumber: requiredString("Your phone number is required."),
  password: requiredString("Your password is required.").min(6),
  conpassword: requiredString("Please confirm your password.").min(6),
});

/**
 * @author JM
 * There are multiple missing processes here. I marked down all the locations we can use to integrate the missing process.
 * > Process 1 - JWT Account Creation upon submission on sign up
 * > Process 2 - Send verification code API through email. 
 * > Process 3 - Navigate to verification code entry page
 */

const schema = z
  .discriminatedUnion("hasNoMiddleName", [
    z
      .object({
        hasNoMiddleName: z.literal(false),
        middleName: requiredString(
          "Please provide your middlename or select i do not have a middlename"
        ),
      })
      .merge(clientRegistrationBaseSchema),
    z
      .object({
        hasNoMiddleName: z.literal(true),
        middleName: z.string().optional()
      })
      .merge(clientRegistrationBaseSchema),
  ])
  .refine(
    ({ conpassword, password }) => {
      return password === conpassword;
    },
    { path: ["conpassword"], message: "Password did not match" }
  );
export type ClientAccountCreation = z.infer<typeof schema>;
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);
const SignUpForm = () => {
  const router = useRouter()
  const { control, watch, resetField, trigger, getValues, setValue } =
    useFormContext<ClientAccountCreation>();
  const values = getValues();
  const hasNoMiddleName = watch("hasNoMiddleName");
  const passwordWatcher = watch("password");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);
  const { query }: any = router;
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
    passwordWatcher,
  ]);
  useEffect(() => {
    if(!query){
      return;
    } else {
      setValue('email', query.email)
      setValue('firstName', query.firstname)
      setValue('lastName', query.lastname)
    }
  }, [])
  const result = zxcvbn(values.password == undefined ? "" : values.password);
  return (
    <>
      <ControlledGrid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            shouldUnregister
            name="firstName"
            label="Firstname"
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required={!hasNoMiddleName}
            shouldUnregister
            name="middleName"
            label="Middlename"
            disabled={hasNoMiddleName}
          />
          <ControlledCheckbox
            control={control}
            name="hasNoMiddleName"
            label="I do not have a middlename"
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextField
            control={control}
            required
            shouldUnregister
            name="lastName"
            label="Lastname"
          />
        </Grid>
      </ControlledGrid>
      <ControlledGrid>
        <Grid item xs={6}>
          <ControlledTextField
            control={control}
            required
            shouldUnregister
            name="email"
            label="Email"
          />
        </Grid>
        <Grid item xs={6}>
          <ControlledMobileNumberField
            control={control}
            name='phoneNumber'
            label='Mobile number'
            required
            shouldUnregister
          />
        </Grid>
      </ControlledGrid>
      <ControlledTextField
        control={control}
        required
        shouldUnregister
        name="password"
        label="Password"
        type="password"
      />
      <PasswordStrengthMeter result={result} />
      <ControlledTextField
        control={control}
        required
        shouldUnregister
        name="conpassword"
        label="Confirm Password"
        type="password"
      />
      <FormGroup>
        <FormControlLabel
          control={<Checkbox />}
          label={
            <Typography variant="caption">
              <span style={{ color: "#808080" }}>
                By creating an account, you agree to our
              </span>{" "}
              <span style={{ fontWeight: "bold", color: "#973B74" }}>
                terms
              </span>{" "}
              and{" "}
              <span style={{ fontWeight: "bold", color: "#973B74" }}>
                privacy policy
              </span>
              .
            </Typography>
          }
        />
      </FormGroup>
    </>
  );
};

export const SignUpAdditionalForm = () => {
  const [clientDetailsAtom, setClientDetailsAtom] = useAtom(ClientCreationAtom);
  const [loading, setLoading] = useState(false)
  const SecureSendVerificationCode = useSecureHiddenNetworkApi(
    async (api, args: VerificationProps) => await api.secure.sla_send_verification_code_securely(args)
  );
  const useSecureVerificationCodeSender = useMutation((data: VerificationProps) => 
    SecureSendVerificationCode.execute(data)
  );
  const checkEmailOnCustomerRegistration = useApiCallBack(
    async (api, email: string) => await api.users.findEmailOnCustomerRegistration(email)
  )
  const form = useForm<ClientAccountCreation>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: clientDetailsAtom ?? { hasNoMiddleName: false },
  });
  const { handleOnToast } = useToastContext()
  const {
    formState: { isValid },
    getValues
  } = form;
  const router = useRouter();
  
  const handleContinue = () => {
    const values = getValues()
    setLoading(!loading)
    const obj = {
      email: values.email,
      phoneNumber: values.phoneNumber,
      code: 'auto-generated-server-side',
      resendCount: 0,
      isValid: 1,
      type: 'email',
      verificationCredentials: {
        email: values.email
      }
    }
    checkEmailOnCustomerRegistration.execute(values.email)
    .then((res: AxiosResponse | undefined) => {
      if(res?.data == 501) {
        handleOnToast(
          "The email provided is already exists.",
          "top-right",
          false,
          true,
          true,
          true,
          undefined,
          "dark",
          "error"
        );
        setLoading(false)
      } else {
        useSecureVerificationCodeSender.mutate(obj, {
          onSuccess: (secured: any) => {
            if(secured.data == 200) {
              setClientDetailsAtom(values)
              setLoading(false)
              /* Navigate to verification code entry page. */
              router.push('/verification/verify-account')
            } else {
              handleOnToast(
                "You've reached the maximum sent email. Please use the last code sent to your email",
                "top-right",
                false,
                true,
                true,
                true,
                undefined,
                "dark",
                "error"
              );
              setLoading(false)
            }
          },
          onError: (error) => {
            handleOnToast(
              "Something went wrong. Please try again",
              "top-right",
              false,
              true,
              true,
              true,
              undefined,
              "dark",
              "error"
            );
            setLoading(false)
          }
        })
      }
    })
  }
  return (
    <>
      <Container>
        <div style={{ padding: '20px' }}>
        <UncontrolledCard
          style={{
            borderRadius: "30px 30px 30px 30px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <img
                src="cl-signup.png"
                style={{
                  width: "100%",
                  height: "auto",
                  marginTop: "250px",
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <FormProvider {...form}>
                <div
                  style={{
                    float: "right",
                    marginBottom: "10px",
                    padding: "10px",
                  }}
                >
                  <Typography variant="caption">
                    <span style={{ color: "#808080" }}>
                      Already have account?
                    </span>{" "}
                  </Typography>
                  <Typography
                    onClick={() => router.push("/login")}
                    variant="caption"
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#973B74",
                        cursor: "pointer",
                      }}
                    >
                      Log in
                    </span>
                  </Typography>
                </div>
                <Container maxWidth="md" sx={{ padding: "50px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "50px",
                    }}
                  >
                    <Typography variant="h5" gutterBottom fontWeight={"bold"}>
                      Get started by signing up
                    </Typography>
                  </div>

                  <SignUpForm />
                  <div className="flex justify-center items-center">
                    <button
                      disabled={!isValid}
                      className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#973B74",
                        width: "150px",
                      }}
                      onClick={handleContinue}
                    >
                      Sign Up
                    </button>
                  </div>
                  {/* <Divider sx={{ marginTop: "10px" }}>or</Divider>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <GoogleButton
                      style={{ width: "250px", marginTop: "20px" }}
                    />
                  </div> */}
                </Container>
              </FormProvider>
            </Grid>
          </Grid>
        </UncontrolledCard>
        </div>
        <ControlledBackdrop open={loading} />
      </Container>
    </>
  );
};
