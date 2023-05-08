import { createContext, useContext, useState } from "react";
import { MAX_FORGOT_FORM_STEPS } from "@/components/ForgotPassword";

interface ActiveStepsContextState {
    activeStep: number
    setActiveStep : (step: number) => void;
    next: (max_array_string: string) => void;
    previous: () => void;
}

export const ActiveStepsContext = createContext<ActiveStepsContextState>({
    activeStep: 0,
    setActiveStep: () => {},
    next: (max_array_string: string) => {},
    previous: () => {}
})

export const ActiveStepsProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children
}) => {
    const [activeStep, setActiveStep] = useState(0)
    const next = (max_array_string : string) => {
        switch(max_array_string){
            case "forgot-password":
                if(activeStep >= MAX_FORGOT_FORM_STEPS) {
                    return;
                }
                setActiveStep(activeStep + 1)
                break;
            
        }
    }
    const previous = () => {
        if(activeStep <= 0) {
            return;
        }
        setActiveStep(activeStep - 1)
    }
    return (
        <ActiveStepsContext.Provider
        value={{
            activeStep,
            setActiveStep,
            next,
            previous
        }}
        >
            {children}
        </ActiveStepsContext.Provider>
    )
}

export const useActiveStepContext = () => {
    if(!ActiveStepsContext) {
        throw new Error("Active steps should be used")
    }
    return useContext(ActiveStepsContext)
}