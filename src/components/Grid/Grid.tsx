import { Grid } from "@mui/material";


type GridProps = {
    children: React.ReactNode
}

const ControlledGrid: React.FC<GridProps> = (props) => {
    const { children } = props

    return(
        <Grid style={{justifyContent: 'center', marginTop : '10px'}} container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3}}>
            {children}
        </Grid>
    )
}

export default ControlledGrid