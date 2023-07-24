import {
    InputAdornment,
    Box,
    OutlinedInputProps,
    Divider
} from '@mui/material'
import { PhFlag } from './icon/PhFlag'
import React, { ChangeEventHandler} from 'react'
import { ControlledField } from '.'
import { MaskInput, MaskInputProps } from './MaskInput'
import { Controller, FieldValues } from 'react-hook-form'
import { TextField } from './TextField'

type CountryCodeEntry = {
    code: string
    icon: React.FC
}

const CountryCodes: Record<string, CountryCodeEntry> = {
    PH: {
        code: '63',
        icon: PhFlag
    }
}

type Props = Pick<OutlinedInputProps, 'value' | 'label'> & {
    country?: keyof typeof CountryCodes
    required?: boolean
    onBlur?: () => void
    onChange?: (_v: string) => void;
    helperText?: string
    error?: boolean
    disabled?: boolean
}

const MobileMaskInput = React.forwardRef<HTMLElement, MaskInputProps>(function TextMaskCustom(
 props,
 ref
){
    return <MaskInput {...props} ref={ref} mask='000 000 0000' />
})

export const MobileNumberField: React.FC<Props> = ({
 label,
 onChange,
 onBlur,
 country = 'PH',
 error,
 ...rest
}) => {
    const { code: countryCode, icon: Icon } = CountryCodes[country]

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target?.value;

        onChange?.(value?.replace(/\s+/g, ''));
    }
    const handleBlur = () => onBlur?.();

    return (
        <TextField 
        label={label}
        inputComponent={MobileMaskInput as any}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="123 456 7890"
        error={Boolean(error)}
        startAdornment={
            <InputAdornment
            sx={{
                '& hr': {
                    mx: 0.5
                }
            }}
            position='start'
            >
                <Box sx={{ mr: 0.5, alignItems: 'center', display: 'flex'}}>
                    <Icon />
                    <Box sx={{fontSize: '0.85rem', color: 'black'}}>+{countryCode}</Box>
                    <Divider sx={{ height: '1em', px: 0.5 }} variant='middle' orientation='vertical' />
                </Box>
            </InputAdornment>
        }
        {...rest}
        />
    )
}

type ControlledMobileNumberFieldProps<T extends FieldValues> = ControlledField<T> & Props;

export function ControlledMobileNumberField<T extends FieldValues>({
control, name, ...rest
}: ControlledMobileNumberFieldProps<T>){
    return (
        <Controller 
        control={control}
        name={name}
        render={({ field: {onChange, onBlur, value}, fieldState: { error }}) => (
            <MobileNumberField 
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            error={Boolean(error?.message)}
            helperText={error?.message}
            {...rest}
            />
        )}
        />
    )
}