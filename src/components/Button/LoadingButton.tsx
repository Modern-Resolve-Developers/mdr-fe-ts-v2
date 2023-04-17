import {
    Button, CircularProgress, ButtonProps
} from '@mui/material'
import Save from '@mui/icons-material/Save'

export const LoadingButton: React.FC<Omit<ButtonProps, ''> & {
    component?: string
    loading: boolean
}> = (props) => {
    const {
        variant,
        color,
        onClick,
        loading
    } = props;
    return (
        <Button
        variant={variant}
        color={color}
        disabled={loading}
        onClick={onClick}
        {...props}
        >
            {loading ? <CircularProgress size={24} /> : <Save />}
            &nbsp;Save
        </Button>
    )
}