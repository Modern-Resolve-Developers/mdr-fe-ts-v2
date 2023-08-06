import { Container, Box, Typography, Grid } from "@mui/material";
import { OnboardingStepper } from "../Stepper/MuiStepper/MuiStepper";
import { EmailDetailsForm, VerificationDetailsForm } from "./forms";
import { FormProvider } from "react-hook-form";
import UncontrolledCard from "../Cards/Card";

import { NewCredentialsDetailsForm } from "./forms/NewCredentialsForms";

import { Completed } from "./forms/Completed";
import { useActiveSteps } from "@/utils/hooks/useActiveSteps";
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
  const { activeStep } = useActiveSteps(MAX_FORGOT_FORM_STEPS)
  const { label, form: ActiveForm } = FORGOT_FORM_MAP[activeStep];

  return (
    <>
      <Container className="forgot-pw-container">
        <UncontrolledCard className="mdr-forgot-pwCard">
          <Box className="forgot-pw-heading">
            <img className="mdr-logo" src="mdr-updated-logo.png" alt="mdrLogo"/>
            <Typography className="forgot-pw-title" variant="subtitle1">
              Forgot Password
            </Typography>
          </Box>
          <OnboardingStepper
            steps={[
              "Email Information",
              "Verification",
              "New Credentials",
              "Completed",
            ]}
            sx={{ mt: '20px', mb: '20px' }}
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
