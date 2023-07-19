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
import { CSSProperties, useEffect } from "react";
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
import { useApiCallBack } from "@/utils/hooks/useApi";
import { useMutation } from "react-query";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { PasswordStrengthMeter } from "../PasswordStrengthMeter/PasswordStrengthMeter";
import { LockClosedIcon } from "@heroicons/react/20/solid";

import {
  accountClientCreationAtom,
  ClientCreationAtom,
} from "@/utils/hooks/useAccountAdditionValues";
const clientRegistrationBaseSchema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required"),
  email: requiredString("Your email is required.").email(),
  password: requiredString("Your password is required."),
  conpassword: requiredString("Please confirm your password."),
});

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
  const { control, watch, resetField, trigger, getValues } =
    useFormContext<ClientAccountCreation>();
  const values = getValues();
  const hasNoMiddleName = watch("hasNoMiddleName");
  const passwordWatcher = watch("password");
  const hasNoMiddleNamePrevValue = usePreviousValue(hasNoMiddleName);
  useEffect(() => {
    resetField("middleName");
    if (hasNoMiddleNamePrevValue) {
      trigger("hasNoMiddleName");
    }
  }, [
    hasNoMiddleName,
    hasNoMiddleNamePrevValue,
    resetField,
    trigger,
    passwordWatcher,
  ]);

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
      <ControlledTextField
        control={control}
        required
        shouldUnregister
        name="email"
        label="Email"
      />
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
  const form = useForm<ClientAccountCreation>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: clientDetailsAtom ?? { hasNoMiddleName: false },
  });
  const {
    formState: { isValid },
    handleSubmit,
  } = form;
  const router = useRouter();
  const styled: CSSProperties = {
    position: "absolute",
    width: "150px",
    height: "19px",
    left: "51px",
    top: "27px",
    color: "white",
  };
  return (
    <>
      <NormalButton
        style={styled}
        onClick={() => router.push("/")}
        children={<Typography variant="overline">Back to home</Typography>}
        variant="text"
      />
      <Container sx={{ padding: "50px" }}>
        <UncontrolledCard
          style={{
            borderRadius: "30px 30px 30px 30px",
            marginTop: "50px",
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
                    >
                      Sign Up
                    </button>
                  </div>
                  <Divider sx={{ marginTop: "10px" }}>or</Divider>
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
                  </div>
                </Container>
              </FormProvider>
            </Grid>
          </Grid>
        </UncontrolledCard>
      </Container>
    </>
  );
};
