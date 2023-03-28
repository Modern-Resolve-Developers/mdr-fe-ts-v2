import {Avatar} from '@mui/material'

type AvatarProps = {
    url : string
    alt: string
    sx?: any
}

const ControlledAvatar: React.FC<AvatarProps> = (
    props
) => {
    return (
        <>
            <Avatar 
            src={props.url}
            alt={props.alt}
            sx={props.sx}
            />
        </>
    )
}

export default ControlledAvatar