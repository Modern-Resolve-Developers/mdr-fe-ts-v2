import {
    Typography,
    Grid
} from '@mui/material'
import { useRouter } from 'next/router'
import ControlledGrid from '@/components/Grid/Grid'
import { useEffect, useState } from 'react'
import ControlledBackdrop from '@/components/Backdrop/Backdrop'
import { verificationAtom, emailAtom, newCredentialsAtom } from '@/utils/hooks/useAccountAdditionValues'
import { useAtom } from 'jotai'
import { useActiveSteps } from '@/utils/hooks/useActiveSteps'
import { MAX_FORGOT_FORM_STEPS } from '..'
import { Box } from "@mui/material";

export const Completed = () => {
    const [verify, setVerify] = useAtom(verificationAtom)
    const [email, setEmail] = useAtom(emailAtom)
    const [credentials, setCredentials] = useAtom(newCredentialsAtom)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { setActiveStep } = useActiveSteps(MAX_FORGOT_FORM_STEPS)
    useEffect(() => {
        setOpen(!open)
        setTimeout(() => {
            setVerify(undefined)
            setEmail(undefined)
            setCredentials(undefined)
            setActiveStep(0)
            router.push('/login')
        }, 3000)
    }, [])
    return (
        <Box className="stepper-container">
            <ControlledGrid>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <Typography variant='subtitle1'>Completed</Typography>
                    <video src='https://cdn.dribbble.com/users/458522/screenshots/13953991/media/b2f464e5bd48bb5cf0a134607872188b.mp4' style={{
                        width: '100%',
                        height: 'auto'
                    }}></video>
                </Grid>
                <Grid item xs={4}></Grid>
            </ControlledGrid>
            <ControlledBackdrop open={open} />
        </Box>
    )
}