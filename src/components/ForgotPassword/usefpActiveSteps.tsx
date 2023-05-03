import { atom, useAtom } from "jotai";
import { MAX_FORGOT_FORM_STEPS } from ".";
export const activefpStepAtom = atom(0);
export const usefpActiveStep = () => {
  const [activeStep, setActiveStep] = useAtom(activefpStepAtom);

  const next = () => {
    if (activeStep >= MAX_FORGOT_FORM_STEPS) {
      return;
    }
    setActiveStep(activeStep + 1);
  };
  const previous = () => {
    if (activeStep <= 0) {
      return;
    }
    setActiveStep(activeStep - 1);
  };
  return {
    activeStep,
    setActiveStep,
    next,
    previous,
  };
};
