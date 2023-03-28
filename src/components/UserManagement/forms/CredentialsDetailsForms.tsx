import { useState, useContext, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { requiredString } from "@/utils/formSchema";
import { usePreviousValue } from "@/utils/hooks/usePreviousValue";
import { BottomButtonGroup } from "./BottomButtonGroup";

import { useForm, FormProvider, useFormContext } from "react-hook-form";

import { ToastContextContinue } from "@/utils/context/base/ToastContext";
import { ToastContextSetup } from "@/utils/context";

import { useActiveStep } from "../useActiveStep";

import { useAtom } from "jotai";
import { credentialAccountDetailsAtom, personalAccountDetailsAtom } from "@/utils/hooks/useAccountAdditionValues";
import { ControlledTextField } from "@/components/TextField/TextField";

import {DevTool} from "@hookform/devtools";
import {Container} from "@mui/material";

import { buildHttp } from "@/pages/api/http";
import ControlledBackdrop from "@/components/Backdrop/Backdrop";

import { useApiCallBack } from "@/utils/hooks/useApi";

import { UAMAddRequestArgs } from "@/pages/api/users/types";
import { AuthenticationJwtCreateAccount } from "@/pages/api/Authentication/types";
const credentialsBaseSchema = z.object({
    email : requiredString("Your email is required.").email(),
    password: requiredString("Your password is required."),
    conpassword: requiredString("Please confirm your password.")
})
.refine(
    ({ conpassword, password }) => {
        return password === conpassword
    },
    { path: ['conpassword'], message: "Password did not match"}
)

export type CredentialsAccountCreation = z.infer<typeof credentialsBaseSchema>

const CredentialDetailsForm = () => {
    const {
        control
    } = useFormContext<CredentialsAccountCreation>();

    return (
        <>
            <Container>
                <ControlledTextField
                    control={control}
                    required
                    name="email"
                    label="Email"
                    shouldUnregister
                />
                <ControlledTextField
                    control={control}
                    required
                    name="password"
                    label="Password"
                    type='password'
                    shouldUnregister
                />
                <ControlledTextField
                    control={control}
                    required
                    name="conpassword"
                    label="Confirm Password"
                    type='password'
                    shouldUnregister
                />
            </Container>
            <DevTool control={control} />
        </>
    )
}

export const CredentialsOwnershipDetailsForm = () => {
    const [credentialsDetailAtom, setCredentialsDetailAtom] = useAtom(credentialAccountDetailsAtom)
    const [personalDetailsAtom, setPersonalDetailsAtom] = useAtom(personalAccountDetailsAtom)
    const [open, setOpen] = useState(false)
    const uamcheckemail = useApiCallBack((api, email: string) => api.users.UAMCheckEmail(email))
    const uamadduser = useApiCallBack(async (api, args : UAMAddRequestArgs) => await api.users.UAMAddUsersFunc(args))
    const authjwtAccountCreation = useApiCallBack(
        async (api, args: AuthenticationJwtCreateAccount) => await api.authentication.authenticationJwtCreateAccount(args)
    )
    const {
        handleOnToast
    } = useContext(ToastContextContinue) as ToastContextSetup
    const form = useForm<CredentialsAccountCreation>({
        resolver: zodResolver(credentialsBaseSchema),
        mode: 'all',
        defaultValues: credentialsDetailAtom
    })
    const {
        formState: { isValid },
        handleSubmit,
        reset
    } = form
    const { next } = useActiveStep()
    const handleContinue = () => {
        setOpen(!open)
        handleSubmit(
            (values) => {
                const uam_add_request_data = {
                    firstname: personalDetailsAtom?.firstName,
                    lastname: personalDetailsAtom?.lastName,
                    middlename : personalDetailsAtom?.hasNoMiddleName ? "N/A" : personalDetailsAtom?.middleName,
                    email: values.email,
                    password : values.password,
                    userType: personalDetailsAtom?.userType
                }
                uamcheckemail.execute(uam_add_request_data.email)
                .then((logger: any) => {
                    if(logger?.data == 'email_exist'){
                        setOpen(false)
                        reset({})
                        handleOnToast(
                            "This email is already taken.",
                            "top-right",
                            false,
                            true,
                            true,
                            true,
                            undefined,
                            "dark",
                            "error"
                        )
                        return;
                    } else {
                        console.log(uam_add_request_data)
                        uamadduser.execute(uam_add_request_data)
                        .then((repository: any) => {
                            const { data } : any = repository
                            if(data == 'success') {
                                const jwtobj = {
                                    jwtusername : uam_add_request_data.email,
                                    jwtpassword: uam_add_request_data.password,
                                    isValid : "1"
                                }
                                authjwtAccountCreation.execute(jwtobj).then((turbo) => {
                                    if(turbo?.data?.status === 'Success') {
                                        handleOnToast(
                                            "Successfully added",
                                            "top-right",
                                            false,
                                            true,
                                            true,
                                            true,
                                            undefined,
                                            "dark",
                                            "success"
                                        )
                                        setCredentialsDetailAtom(values)
                                        next()
                                    }
                                })
                            }
                        })
                    }
                })
            },
            (error) => console.log(error)
        )();
        return false;
    }
    return (
        <FormProvider {...form}>
            <CredentialDetailsForm />
            <BottomButtonGroup disabledContinue={!isValid} onContinue={handleContinue} />
            <ControlledBackdrop open={open} />
        </FormProvider>
    )
}