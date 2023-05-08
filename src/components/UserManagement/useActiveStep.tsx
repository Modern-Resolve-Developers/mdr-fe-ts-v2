import { atom, useAtom } from "jotai";
import { MAX_TASK_UAM_STEPS } from "../TaskManagement";

export const activeStepAtom = atom(0);
export const useActiveStep = () => {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);

  const next = () => {
    if (activeStep >= MAX_TASK_UAM_STEPS) {
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
