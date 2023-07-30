import { Container, Box, Typography, Grid } from "@mui/material";
import { OnboardingStepper } from "../Stepper/MuiStepper/MuiStepper";
import { EmailDetailsForm, VerificationDetailsForm } from "./forms";
import { FormProvider } from "react-hook-form";
import UncontrolledCard from "../Cards/Card";

import { NewCredentialsDetailsForm } from "./forms/NewCredentialsForms";
import { useActiveStepContext } from "@/utils/context/base/ActiveStepsContext";
import { Completed } from "./forms/Completed";
const FORGOT_FORM_MAP: Array<{ label: string; form: React.FC }> = [
  {
    label: "Email Details",
    form: EmailDetailsForm,
  },
  {
    label: "Verification Details",
    form: VerificationDetailsForm,
  },
  {
    label: 'New Credentials',
    form: NewCredentialsDetailsForm
  },
  {
    label: 'Completed',
    form : Completed
  }
];

export const MAX_FORGOT_FORM_STEPS = FORGOT_FORM_MAP.length;

export const ForgotPasswordAdditionalDetails = () => {
  const { activeStep } = useActiveStepContext()
  const { label, form: ActiveForm } = FORGOT_FORM_MAP[activeStep];

  return (
    <>
      <Container className="forgot-pw-container" sx={{ pt: 30 }}>
        <UncontrolledCard className="mdr-forgot-pwCard">
          <Typography className="forgot-pw-title" variant="subtitle1">
          Forgot Password
          </Typography>
          <img className="mdr-logo" src="mdr-updated-logo.png" alt="mdrLogo"/>
          <OnboardingStepper
            steps={[
              "Email Information",
              "Verification",
              "New Credentials",
              "Completed",
            ]}
            sx={{ mt: 3 }}
            activeStep={activeStep}
          />
          <Box mt={2} width="100%">
            <ActiveForm />
          </Box>
        </UncontrolledCard>
      </Container>
    </>
  );
};
