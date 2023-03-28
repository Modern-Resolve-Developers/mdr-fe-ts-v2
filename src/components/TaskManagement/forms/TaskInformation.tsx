import { ControlledTextField } from "@/components/TextField/TextField";
import {Grid, Typography, IconButton, Box} from '@mui/material'
import ControlledGrid from "@/components/Grid/Grid";
import { useState, useEffect } from 'react'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { BottomButtonGroup } from "@/components/UserManagement/forms/BottomButtonGroup";

import { useForm, FormProvider, useFormContext, useFieldArray } from "react-hook-form";

import { useAtom } from "jotai";

import { ControlledRichTextField } from "@/components/TextField/RichTextField";
import { taskInformationAtom } from "@/utils/hooks/useAccountAdditionValues";
import { useActiveStepTask } from "../useActiveStep";
import { Button, TextField } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import UncontrolledCard from "@/components/Cards/Card";

import { ControlledSelectField } from "@/components/SelectField";

import DeleteIcon from '@mui/icons-material/Delete';
const taskInformationBaseSchema = z.object({
    title: requiredString("Title is required."),
    description: requiredString("Description is required."),
    imgurl: z.any().optional(),
    priority: requiredString("Kindly set task priority level."),
    subtask: z.object({
        task: requiredString("Title is required."),
        priority: requiredString("Kindly set task priority level.")
    }).array()
})

export type TaskInformationCreation = z.infer<typeof taskInformationBaseSchema>


const TaskInformationForm = () => {
    
    const [taskPriority, setTaskPriority] = useState([
        {
            name: 'Lowest Priority',
            label: 'Lowest Priority',
            value: 'lowest'
        },
        {
            name: 'Low Priority',
            label: 'Low Priority',
            value: 'low'
        },
        {
            name: 'Medium Priority',
            label: 'Medium Priority',
            value: 'medium'
        },
        {
            name: 'High Priority',
            label: 'High Priority',
            value: 'high'
        },
        {
            name: 'Highest Priority',
            label: 'Highest Priority',
            value: 'highest'
        },
    ])
    const {
        setValue,
        control,
        watch,
        trigger,
        getValues
    } = useFormContext<TaskInformationCreation>()

    const { fields, append, remove } = useFieldArray({ name: 'subtask', control });
    const handleChange = (event : string) => {
        setValue('description', JSON.stringify(event))
    }

    const OnAddSubTask = () => {
        append({ task:'', priority: ''})
    }
    const description = watch('description')
    useEffect(() => {
        trigger('description')
    }, [description, trigger])

    return (
        <>
            <ControlledGrid>
                <Grid item xs={6}>
                    <ControlledTextField 
                        control={control}
                        required    
                        name='title'
                        label='Title'
                        shouldUnregister
                    />
                </Grid>
                <Grid item xs={6}>
                    <ControlledRichTextField
                    handleChange={handleChange}
                     />
                </Grid>
            </ControlledGrid>
            <ControlledGrid>
                <Grid item xs={6}>
                {
                    fields.map((item, i) => (
                        <>
                            <div key={i}>
                                <UncontrolledCard style={{marginBottom: '10px'}}>
                                    <IconButton onClick={() => remove(i)} sx={{ float: 'right'}} aria-label="delete">
                                        <DeleteIcon />
                                    </IconButton>
                                   <Box sx={{mt: 5}}>
                                   <ControlledTextField 
                                    control={control}
                                    name={`subtask.${i}.task`}
                                    required
                                    label='Subtask title'
                                    shouldUnregister
                                    />
                                     <ControlledSelectField 
                                    control={control}
                                    name={`subtask.${i}.priority`}
                                    options={taskPriority}
                                    label="Subtask Priority"
                                    required
                                    />
                                   </Box>
                                </UncontrolledCard>
                            </div>
                        </>
                    ))
                }
                <Button variant="outlined" onClick={OnAddSubTask} startIcon={<AddIcon />}>
                    Add subtask (OPTIONAL)
                </Button>
                </Grid>
                <Grid item xs={6}>
                    <ControlledSelectField 
                    control={control}
                    name='priority'
                    options={taskPriority}
                    label="Task Priority"
                    required
                    />
                </Grid>
            </ControlledGrid>
        </>
    )
}

export const TaskInformationDetailsForm = () => {
    const [taskInformationDetailsAtom, setTaskInformationDetailsAtom] = useAtom(taskInformationAtom)
    const form = useForm<TaskInformationCreation>({
        resolver: zodResolver(taskInformationBaseSchema),
        mode: 'all',
        defaultValues: taskInformationDetailsAtom
    })

    const {
        formState : {isValid},
        handleSubmit
    } = form

    const { next } = useActiveStepTask()
    const handleContinue = () => {
        handleSubmit(
            (values) => {
                setTaskInformationDetailsAtom(values)
                next()
            },
            (error) => console.log(error)
        )()
        return false;
    }

    return (
        <FormProvider {...form}>
            <TaskInformationForm />
            <BottomButtonGroup disabledContinue={!isValid} onContinue={handleContinue}></BottomButtonGroup>
        </FormProvider>
    )
}