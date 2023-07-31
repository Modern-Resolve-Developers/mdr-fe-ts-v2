import MoreVertIcon from '@mui/icons-material/MoreVert';
import { 
    IconButton, Button, Popover, SxProps, Theme
} from '@mui/material'
import { cloneElement } from 'react';

type PopoverProps = {
    children: React.ReactNode
    open: boolean
    anchorEl: any | null
    handleShowPopOver: (event: React.MouseEvent<HTMLButtonElement>, id?: any) => void
    handleClosePopOver: () => void
    id: any
    anchorOrigin: any
    sx?: SxProps<Theme>
}

export const ControlledPopoverButton: React.FC<PopoverProps> = (props) => {
    const {
        children,
        open,
        anchorEl,
        handleShowPopOver,
        handleClosePopOver,
        id,
        anchorOrigin,
        sx
    } = props;

    return (
        <>
            <IconButton sx={sx} aria-describedby={id} onClick={handleShowPopOver}>
                <MoreVertIcon />
            </IconButton>
            <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClosePopOver}
            anchorOrigin={anchorOrigin}
            >
                {children}
            </Popover>
        </>
    )
}