import { Button, Grid } from "@mui/material";
import { PrimaryButton } from "@/components/Button";
import { useActiveStepContext } from "@/utils/context/base/ActiveStepsContext";

export type BottomButtonGroupProps = {
  continueButtonLabel?: string;
  onContinue?: () => boolean;
  onBack?: () => boolean;
  hideBack?: boolean;
  disabledContinue?: boolean;
  resendBtn?: boolean;
  disableBtn?: boolean;
  onresend?: () => void
  countdown?: number
};

export const BottomButtonGroup: React.FC<BottomButtonGroupProps> = ({
  continueButtonLabel = "Continue",
  onContinue,
  onBack,
  hideBack,
  disabledContinue,
  resendBtn,
  disableBtn,
  onresend,
  countdown
}) => {
  // const { nextfp, previous } = usefpActiveStep();
  const { next, previous } = useActiveStepContext()
  const handleContinue = () => {
    if (onContinue !== undefined) {
      if (!onContinue()) return;
    }
    next("forgot-password");
  };
  const handleBack = () => {
    if (onBack !== undefined) {
      if (!onBack()) return;
    }
    previous();
  };
  return (
    <>
     {
        resendBtn && <Grid item xs={8} display="flex" justifyContent="center">
        <Button
            sx={{ mx: "auto", mt: 2, width: [, 300] }}
            color="warning"
            variant="outlined"
            fullWidth
            disabled={disableBtn}
            onClick={onresend}
          >
            {disableBtn
              ? `Resend is disable for ${countdown} seconds`
              : "Resend"}
        </Button>
      </Grid>
     }
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
