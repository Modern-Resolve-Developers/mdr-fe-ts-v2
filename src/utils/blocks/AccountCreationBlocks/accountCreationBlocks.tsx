import { ControlledBackdrop, ControlledGrid, UncontrolledCard } from "@/components"
import { ControlledCheckbox } from "@/components/Checkbox/Checkbox"
import { ControlledTextField } from "@/components/TextField/TextField"
import { Button, Container, Grid, Typography } from "@mui/material"
import { FormProvider } from "react-hook-form"
import { FieldProps } from "@/utils/pageHooks/hooks/useLayout"



export const AccountCreationBlocks: React.FC<FieldProps> = (props : FieldProps) => {
    const {
        control,
        hasNoMiddleName,
        form,
        handleSubmit,
        isValid,
        onSubmit,
        open
    } = props;
    return (
        <>
              <Container style={{marginTop: '100px'}}>
                <UncontrolledCard>
                    <Typography variant="h5" mb="2">Administrator Information</Typography>
                    <hr/>
                <FormProvider {...form}>
                            <ControlledGrid>
                                <Grid item xs={4}>
                                    <ControlledTextField 
                                    control={control}
                                    required
                                    name="firstName"
                                    label="Firstname"
                                    shouldUnregister={true}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <ControlledTextField 
                                    control={control}
                                    disabled={hasNoMiddleName}
                                    name="middleName"
                                    required={!hasNoMiddleName}
                                    label="Middlename"
                                    shouldUnregister={true}
                                    />
                                    <ControlledCheckbox
                                                control={control}
                                                name="hasNoMiddleName"
                                                label="I do not have a middle name"
                                                />
                                </Grid>
                                <Grid item xs={4}>
                                    <ControlledTextField 
                                    control={control}
                                    required
                                    name="lastName"
                                    label="Lastname"
                                    shouldUnregister={true}
                                    />
                                </Grid>
                            </ControlledGrid>
                            <ControlledGrid>
                                <Grid item xs={4}>
                                    <ControlledTextField 
                                    control={control}
                                    required
                                    name="email"
                                    label="Email"
                                    shouldUnregister={true}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                <ControlledTextField 
                                    control={control}
                                    required
                                    name="password"
                                    label="Password"
                                    shouldUnregister={true}
                                    type="password"
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <ControlledTextField 
                                    control={control}
                                    required
                                    name="conpassword"
                                    label="Confirm Password"
                                    shouldUnregister={true}
                                    type="password"
                                    />
                                </Grid>
                            </ControlledGrid>
                            <Button
                                    variant='contained'
                                    color="primary"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!isValid}
                                    style={{
                                        float: 'right',
                                        marginTop: '10px',
                                        marginBottom: '10px'
                                    }}
                                    
                                    >Submit</Button>
                       </FormProvider>
                </UncontrolledCard>
                <ControlledBackdrop open={open} />
            </Container>
        </>
    )
}

