import { IMaskInput } from 'react-imask'
import React from 'react'

export type MaskInputProps = {
    onChange: (event: { target: {name: string, value: string }}) => void;
    name: string
    mask: string
}

export const MaskInput = React.forwardRef<HTMLElement, MaskInputProps>(function TextMaskCustom(
    props,
    ref
){
    const { onChange, mask, ...other } = props;
    return (
        <IMaskInput 
            {...other}
            mask={mask}
            inputRef={ref as any}
            onAccept={(value: any) => onChange({ target: { name: props.name, value }})}
        />
    )
})