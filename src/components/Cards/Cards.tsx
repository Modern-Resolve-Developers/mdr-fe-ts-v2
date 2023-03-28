import React from "react"
import { Card, CardContent, Typography, CardMedia } from '@mui/material'

export type CardConfigProps = {
    title: string
    sx?: any
    srcimg: string
    description: string
}

type CardProps = {
    cardconfig: CardConfigProps[]
}

const ControlledCard: React.FC<CardProps> = (props) => {
    const { cardconfig } = props
    return (
        <>
            {cardconfig.length > 0 && cardconfig.map((item : any) => {
                return (
                    <Card>
                       <CardMedia
                            sx={{ height: 140 }}
                            image={item.srcimg}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                               {item.description}
                            </Typography>
                        </CardContent>
                    </Card>
                )
            })}
        </>
    )
}

export default ControlledCard