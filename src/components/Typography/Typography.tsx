import { TypographyProps } from ".";
import { Typography } from '@mui/material'

const ControlledTypography: React.FC<TypographyProps> = (props) => {
    const { variant, display, isGutterBottom, text, style } = props

    return (
        <>
            <Typography style={style} variant={variant} display={display} gutterBottom={isGutterBottom}>{text}</Typography>
        </>
    )
}

export default ControlledTypography