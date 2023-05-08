import { Button, Grid } from "@mui/material";
import { PrimaryButton } from "@/components/Button";
import { useActiveStep } from "../useActiveStep";

export type BottomButtonGroupProps = {
  continueButtonLabel?: string;
  onContinue?: () => boolean;
  onBack?: () => boolean;
  hideBack?: boolean;
  disabledContinue?: boolean;
};

export const BottomButtonGroup: React.FC<BottomButtonGroupProps> = ({
  continueButtonLabel = "Continue",
  onContinue,
  onBack,
  hideBack,
  disabledContinue,
}) => {
  const { next, previous } = useActiveStep();
  const handleContinue = () => {
    if (onContinue !== undefined) {
      if (!onContinue()) return;
    }
    next();
  };
  const handleBack = () => {
    if (onBack !== undefined) {
      if (!onBack()) return;
    }
    previous();
  };
  return (
    <>
      <Grid item xs={8} display="flex" justifyContent="center">
        <Button
          sx={{ mx: "auto", mt: 2, width: [, 300] }}
          color="primary"
          variant="outlined"
          fullWidth
          disabled={disabledContinue}
          onClick={handleContinue}
        >
          {continueButtonLabel}
        </Button>
      </Grid>
      {!hideBack && (
        <Grid item xs={8} display="flex" justifyContent="center">
          <Button
            sx={{ mx: "auto", mt: 2, width: [, 300] }}
            fullWidth
            variant="text"
            onClick={handleBack}
          >
            Back
          </Button>
        </Grid>
      )}
    </>
  );
};
