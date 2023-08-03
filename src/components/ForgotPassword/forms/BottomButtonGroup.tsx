import { Button, Grid } from "@mui/material";
import { PrimaryButton } from "@/components/Button";
import { useActiveSteps } from "@/utils/hooks/useActiveSteps";

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
  backtoLogin?: string;
  max_length: number
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
  countdown,
  backtoLogin = "< Back to Log in",
  max_length
}) => {
  // const { nextfp, previous } = usefpActiveStep();
  const { next, previous } = useActiveSteps(max_length)
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
        <Button className="forgot-button"
          sx={{ mx: "auto", mt: 2, width: [, 300] }}
          variant="contained"
          fullWidth
          disabled={disabledContinue}
          onClick={handleContinue}
        >
          {continueButtonLabel}
        </Button>
      </Grid>
      {!hideBack && (
        <Grid item xs={8} display="flex" justifyContent="center">
          <Button className="back-button"
            sx={{ mx: "auto", mt: 2, width: [, 300] }}
            fullWidth
            variant="text"
            onClick={handleBack}
          >
            {backtoLogin}
          </Button>
        </Grid>
      )}
    </>
  );
};
