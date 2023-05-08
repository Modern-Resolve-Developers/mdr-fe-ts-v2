import {
    Typography,
    Button,
    Grid
 } from '@mui/material'
 import { useActiveStepTask } from '../useActiveStep'
 import { useAtom } from 'jotai'
 import { taskInformationAtom, taskAssigneeAtom } from '@/utils/hooks/useAccountAdditionValues'


 export const Completed = () => {
    const { setActiveStep, activeStep } = useActiveStepTask()
    const [taskInfoAtom , setTaskInfoAtom] = useAtom(taskInformationAtom)
    const [taskAssignAtom, setTaskAssigneeAtom] = useAtom(taskAssigneeAtom)

    const handleResetBacktoZero = () => {
        setTaskInfoAtom(undefined)
        setTaskAssigneeAtom(undefined)
        setActiveStep(0)
    }

    return (
        <>
            <Typography variant='h5' mb='2'>Completed</Typography>
            <Grid item xs={12} display='flex' justifyContent='center'>
                <Button
                sx={{ mx: 'auto', mt: 2, width: [, 300]}}
                color='primary'
                variant='outlined'
                fullWidth
                onClick={handleResetBacktoZero}
                >START OVER</Button>
            </Grid>
        </>
    )
 }