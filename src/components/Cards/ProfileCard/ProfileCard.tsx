import { NormalButton } from '@/components/Button/NormalButton'
import {
    Card, CardMedia, CardHeader, Typography, Avatar
} from '@mui/material'

type ProfileCardProps = {
    profilePicture: string
    coverPhoto: string
    name: string | undefined
    position: string | undefined
    children: React.ReactNode
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    profilePicture,
    coverPhoto,
    children,
    name,
    position
}) => {
    return (
        <Card>
            <CardMedia 
                component='img'
                height='194'
                image={coverPhoto}
                alt='Cover photo' />
            <CardHeader 
                avatar={
                    <Avatar alt='profile image' src={profilePicture} />
                }
                title={name}
                subheader={position}
            />
            {children}
        </Card>
    )
}