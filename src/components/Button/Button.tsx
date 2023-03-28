import { Button } from "@mui/material";

type ButtonProps = {
    onClick?: () => void;
    variant: any
    color?: any
    size?: any
    style?: React.CSSProperties
    disabled?: boolean
}

type ButtonSubProps = {
    text: string
}

type Props = ButtonProps & ButtonSubProps

const ControlledButton: React.FC<Props> = (props) => {
    const { text } = props as ButtonSubProps
    
    return (
        <>
            <Button {...props}>
                {text}
            </Button>
        </>
    )
}

export default ControlledButton