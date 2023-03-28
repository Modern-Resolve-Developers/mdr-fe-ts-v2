import { Card, CardContent } from "@mui/material";

type CardProps = {
    children?: React.ReactNode
    style?: React.CSSProperties
}

const UncontrolledCard: React.FC<CardProps> = ({children, style}) => {
    return (
        <>
            <Card style={style}>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </>
    )
}

export default UncontrolledCard