import { Card, CardContent } from "@mui/material";

type CardProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
    className?: any
}

const UncontrolledCard: React.FC<CardProps> = ({children, style, className}) => {
    return (
        <>
            <Card className={className} style={style}>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </>
    )
}

export default UncontrolledCard