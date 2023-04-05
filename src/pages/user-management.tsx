import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useContext, useCallback } from "react";
import { buildHttp } from "./api/http";

import { ControlledBackdrop, ControlledTypography, ProjectTable, ControlledGrid, UncontrolledCard } from "@/components";

import { useRouter } from 'next/router';
import { Container, Grid } from "@mui/material";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";
import { ContextSetup } from "@/utils/context";
import {ARContext} from "@/utils/context/base/AdminRegistrationContext"

import { FormAdditionalDetails } from "@/components/UserManagement";

const UserManagement: React.FC = () => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [savedAuth, setSavedAuth] = useState({})
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const {
        CheckAuthentication
    } = useContext(ARContext) as ContextSetup
    useEffect(() => {
        setOpen(!open)
            CheckAuthentication().then((repository : any) => {
                const { data } : any = repository;
                if(data == 'no_records' || data == 'not_match'){
                    setOpen(false)
                    handleOnToast(
                        "Invalid Token.",
                        "top-right",
                        false,
                        true,
                        true,
                        true,
                        undefined,
                        "dark",
                        "error"
                    )
                    router.push('/login')
                } else if(data == 'no_saved_storage'){
                setOpen(false)   
                }else {
                    setOpen(false)
                    setSavedAuth(data)
                }
            })
    }, [])

    return (
        <>
             <DashboardLayout>
                <Container>
                    <UncontrolledCard>
                            <ControlledTypography
                                variant="h6"
                                isGutterBottom={true}
                                text="User Management"
                                />
                            <FormAdditionalDetails />
                    </UncontrolledCard>
                </Container>
             </DashboardLayout>
        </>
    )
}

export default UserManagement