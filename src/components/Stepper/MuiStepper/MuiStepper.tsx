import {
    StepIconProps,
    Box,
    StepperProps,
    Stepper,
    Step,
    StepLabel,
    Typography,
  } from '@mui/material';
  import CheckIcon from '@mui/icons-material/Check';
  
 
  
  const OnboardingStepIcon: React.FC<StepIconProps> = ({ active, completed }) => {
    return (
      <Box
        sx={{
          borderRadius: '100%',
          borderColor: (theme) => {
            if (completed || active) {
              return '#FAA719';
            }
            return theme.palette.grey[400];
          },
          borderStyle: 'solid',
          borderWidth: () => {
            if (active) return 6;
            return 2;
          },
          backgroundColor: 'white',
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {completed && <CheckIcon sx={{ color: 'secondary.light', width: '0.7em' }} />}
      </Box>
    );
  };
  
  type OnboardingStepperProps = {
    activeStep: number;
    sx?: StepperProps['sx'];
    steps: [] | any
  };

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ activeStep, sx = {}, steps }) => {
    return (
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ width: '100%', px: 0, ...sx }}
        
      >
        {steps.map((label: any, i: any) => (
          <Step sx={{ px: 0 }} key={label} completed={activeStep > i} active={i === activeStep}>
            <StepLabel StepIconComponent={OnboardingStepIcon}>
              <Box sx={{ width: '50%', mx: 'auto' }}>
                <Typography
                  fontWeight={activeStep === i ? 'bold' : 'normal'}
                  fontSize="0.7rem"
                  variant="caption"
                  color={activeStep === i ? '#FAA719' : '#808080'}
                >
                  {label}
                </Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  };