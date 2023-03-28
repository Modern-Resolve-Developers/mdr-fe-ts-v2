import React from 'react'
import { 
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Box
} from '@mui/material'

import { NormalButton } from '../Button/NormalButton'




type StepperProps = {
    activeSteps?: any
    handleNext: () => void;
    handleBack: () => void;
    children: React.ReactNode
    isValid?: any
    steps: any
}

const ControlledStepper: React.FC<StepperProps> = (props) => {
    const { activeSteps, handleBack, handleNext, children, steps } = props

    return (
        <>
            <Stepper activeStep={activeSteps}>
            {steps.map((label : any, index: any) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: { optional?: React.ReactNode} = {};
                return (
                    <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                )
            })}
        </Stepper>
        
        </>
    )
}

export default ControlledStepper