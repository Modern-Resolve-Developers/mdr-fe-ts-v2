import { Backdrop, CircularProgress } from '@mui/material'

type Props = {
    open?: any
}

const ControlledBackdrop: React.FC<Props> = ({
    open
}) => {
    return (
        <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    )
}

export default ControlledBackdrop