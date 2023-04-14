import {Button, ButtonProps} from '@mui/material'

export const OutlinedButton: React.FC<ButtonProps> = (props) => {
    return (
        <Button sx={{ mx: 'auto' , mt: 2, width: [, 300], color: 'red' }} variant="outlined" fullWidth {...props} />
    )
}