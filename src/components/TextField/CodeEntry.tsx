import dynamic from "next/dynamic";
import {
    Box,
    FormHelperTextProps as MuiFormHelperTextProps, Stack, StackProps,
    FormHelperText as MuiFormHelperText,
    OutlinedInputProps,
} from '@mui/material'
import { ErrorFieldIcon } from "./ErrorFieldIcon";
import React from "react";
import { Controller, FieldValues } from "react-hook-form";
import { ControlledField } from ".";
const CodeEntryField = dynamic(import('react-code-input'))

type FormHelperTextProps = MuiFormHelperTextProps & {
    error?: boolean
    showErrorIcon?: boolean
}

type Props = {
    type: any
    fields: number
    onChange: any
    style?: React.CSSProperties
    required: boolean
} & Omit<OutlinedInputProps, "notched"> & Pick<FormHelperTextProps, "showErrorIcon"> & {
    helperText?: string
    containerProps?: StackProps
    name: string
    value: string
}

export const FormHelperText: React.FC<FormHelperTextProps> = ({
    children,
    error,
    sx = {},
    ...rest
}) => {
    return (
        <Stack
        direction="row"
        gap={1}
        alignItems="flex-start"
        justifyContent="flex-start"
        >
            {error && (
                <Box>
                    <ErrorFieldIcon />
                </Box>
            )}
            <MuiFormHelperText sx={{ mt: 0, ...sx }} error={error} {...rest}>
                {children}
            </MuiFormHelperText>
        </Stack>
    )
}

export const CodeEntry: React.FC<Props> = ({
    fields,
    required,
    helperText,
    type,
    style,
    containerProps,
    showErrorIcon,
    error,
    onChange,
    name,
    value
}) => {
    return (
        <Stack gap={1} {...containerProps}>
            <CodeEntryField 
                isValid={required}
                type={type}
                fields={fields}
                inputStyle={style}
                forceUppercase
                autoFocus
                onChange={onChange}
                inputMode={"email"}
                name={name}
                value={value}
            />
            {helperText && (
                <FormHelperText showErrorIcon={showErrorIcon} error={error}>
                    {helperText}
                </FormHelperText>
            )}
        </Stack>
    )
}

type ControlledCodeEntryFieldProps<T extends FieldValues> = 
ControlledField<T> & Props;

export function ControlledCodeEntry<T extends FieldValues>({
    control,
    name,
    shouldUnregister,
    type,
    required,
    fields,
    style
}: ControlledCodeEntryFieldProps<T>){
    return (
        <Controller 
        control={control}
        name={name}
        shouldUnregister={shouldUnregister}
        render={({
           field: { onChange, value },
           fieldState: {error} 
        }) => (
            <CodeEntry 
            onChange={onChange}
            name={name}
            value={value ?? ""}
            error={Boolean(error?.message)}
            helperText={error?.message}
            type={type}
            required={required}
            fields={fields}
            style={style}
            />
        )}
        />
    )
}