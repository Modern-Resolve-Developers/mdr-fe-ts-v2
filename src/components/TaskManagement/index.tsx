import { Container, Box, Typography, Grid } from "@mui/material";
import { OnboardingStepper } from "../Stepper/MuiStepper/MuiStepper";
import {
  TaskInformationDetailsForm,
  TaskAssigneeDetailsForm,
  Completed,
} from "./forms";
import { useActiveStepTask } from "./useActiveStep";

const TASK_MAP: Array<{ label: string; form: React.FC }> = [
  {
    label: "Task Information",
    form: TaskInformationDetailsForm,
  },
  {
    label: "Task Assignee",
    form: TaskAssigneeDetailsForm,
  },
  {
    label: "Completed",
    form: Completed,
  },
];

export const MAX_TASK_UAM_STEPS = TASK_MAP.length;

export const TaskFormAdditionalDetails = () => {
  const { activeStep } = useActiveStepTask();
  const { form: ActiveForm } = TASK_MAP[activeStep];
  return (
    <Container>
      <OnboardingStepper
        sx={{ mt: 3 }}
        activeStep={activeStep}
        steps={["Task Information", "Task Assignee", "Completed"]}
      />
      <Box mt={2} width="100%">
        <ActiveForm />
      </Box>
    </Container>
  );
};
