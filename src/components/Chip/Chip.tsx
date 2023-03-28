import {Chip} from '@mui/material'

type ChipProps = {
    variant?: any
    color: any
    size?: any
    handleDeleteChip?: () => void
    avatar?: any
    icon?: any
    label?: string
}

const ControlledChip: React.FC<ChipProps> = (props) => {
    const {
        variant,
        color,
        size,
        handleDeleteChip,
        avatar,
        icon,
        label
    } = props
    return (
        <>
            <Chip 
            variant={variant}
            color={color}
            size={size}
            onDelete={handleDeleteChip}
            avatar={avatar}
            icon={icon}
            label={label}
            />
        </>
    )
}

export default ControlledChip