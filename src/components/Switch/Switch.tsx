import {
    FormGroup,
    FormControlLabel,
    Switch
} from '@mui/material'

export const ControlledSwitch = (props : { checked: boolean, handleChange: (
    event: React.ChangeEvent<HTMLInputElement>
) => void, inputProps : any, label: string, disabled?: boolean}) => {
    return (
        <FormGroup sx={{ mt: 4}}>
            <FormControlLabel control={
             <Switch 
                checked={props.checked}
                onChange={props.handleChange}
                inputProps={props.inputProps}
                disabled={props.disabled}
             />   
            } label={props.label} />
        </FormGroup>
    )
}