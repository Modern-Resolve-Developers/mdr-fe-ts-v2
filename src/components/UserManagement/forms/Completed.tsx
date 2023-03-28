import {Typography} from "@mui/material";
import { useActiveStep } from "../useActiveStep";
import {Button, Grid} from "@mui/material";

import { useAtom } from 'jotai'
import { personalAccountDetailsAtom, credentialAccountDetailsAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useContext } from "react";
import { ARContext } from "@/utils/context/base/AdminRegistrationContext";
import { ContextSetup } from "@/utils/context";

import { useApiCallBack } from "@/utils/hooks/useApi";

export const Completed = () => {
    const { setActiveStep, activeStep } = useActiveStep()
    const [personalDetailsAtom, setPersonalDetailsAtom] = useAtom(personalAccountDetailsAtom)
    const [credentialsDetailAtom, setCredentialsDetailAtom] = useAtom(credentialAccountDetailsAtom)
    const {
        callBackSyncGetAllUsers
    } = useContext(ARContext) as ContextSetup
    const handleResetBackToZero = () => {
        callBackSyncGetAllUsers()
        setPersonalDetailsAtom(undefined)
        setCredentialsDetailAtom(undefined)
        setActiveStep(0)
    }
    return (
        <>
            <Typography variant="h5" mb="2">Completed</Typography>
            <Grid item xs={12} display='flex' justifyContent='center'>
                <Button
                sx={{ mx: 'auto', mt: 2, width: [, 300]}}
                color='primary'
                variant='outlined'
                fullWidth
                onClick={handleResetBackToZero}
                >START OVER</Button>
            </Grid>
        </>
    )
}