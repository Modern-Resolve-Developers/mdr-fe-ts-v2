import { Container, Box, Typography, Grid } from "@mui/material";
import { OnboardingStepper } from "../Stepper/MuiStepper/MuiStepper";
import { EmailDetailsForm, VerificationDetailsForm } from "./forms";
import { usefpActiveStep } from "./usefpActiveSteps";
import { FormProvider } from "react-hook-form";
import UncontrolledCard from "../Cards/Card";
import { useActiveStep } from "../UserManagement/useActiveStep";

const FORGOT_FORM_MAP: Array<{ label: string; form: React.FC }> = [
  {
    label: "Email Details",
    form: EmailDetailsForm,
  },
  {
    label: "Verification Details",
    form: VerificationDetailsForm,
  },
];

export const MAX_FORGOT_FORM_STEPS = FORGOT_FORM_MAP.length;

export const ForgotPasswordAdditionalDetails = () => {
  const { activeStep } = useActiveStep(MAX_FORGOT_FORM_STEPS);
  const { label, form: ActiveForm } = FORGOT_FORM_MAP[activeStep];

  return (
    <>
      <Container sx={{ mt: 5 }}>
        <UncontrolledCard>
          <Typography variant="subtitle1">
            Digital Resolve | Forgot Password
          </Typography>
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
