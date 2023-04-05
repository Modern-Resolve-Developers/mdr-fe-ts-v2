import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext } from "react";
import { ControlledTypography, UncontrolledCard } from "@/components";

import { useRouter } from "next/router";
import { Container } from "@mui/material";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { ContextSetup } from "@/utils/context";
import { ARContext } from "@/utils/context/base/AdminRegistrationContext";

import { TaskFormAdditionalDetails } from "@/components/TaskManagement";

const Task: React.FC = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [savedAuth, setSavedAuth] = useState({})

    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const {
        CheckAuthentication
    } = useContext(ARContext) as ContextSetup

    return (
        <>
            <DashboardLayout>
                <Container>
                    <UncontrolledCard>
                        <ControlledTypography 
                        variant='h6'
                        isGutterBottom
                        text='Task Management > Create Task'
                        />
                        <TaskFormAdditionalDetails />
                    </UncontrolledCard>
                </Container>
            </DashboardLayout>
        </>
    )
}

export default Task