import { DataGrid } from "@mui/x-data-grid";
import { rowCreativeDesign } from "@/utils/DataGridRowHelper";

import { ProjectTableProps } from ".";


const ProjectTable: React.FC<ProjectTableProps> = ({
    data, openEdit, sx, handleClick, columns, rowIsCreativeDesign = true
}: any) => {
    

    
    return (
        <>
            <DataGrid
            sx={sx}
            rows={rowIsCreativeDesign ? rowCreativeDesign(data) : data}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            disableColumnMenu
            />
        </>
    )
}

export default ProjectTable