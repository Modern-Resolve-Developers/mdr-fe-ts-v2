import { Card, CardContent } from "@mui/material";

type CardProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: any
    elevation?: number
}

const UncontrolledCard: React.FC<CardProps> = ({children, style, className, elevation}) => {
    return (
        <>
            <Card elevation={elevation} className={className} style={style}>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </>
    )
}

export default UncontrolledCard