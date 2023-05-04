import { atom, useAtom } from "jotai";

export const activeStepAtom = atom(0);
export const useActiveStep = (max_array_steps: number) => {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom);

  const next = () => {
    if (activeStep >= max_array_steps) {
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
