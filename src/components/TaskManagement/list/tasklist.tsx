
import { CollapsibleTable } from "@/components/Table/CollapsibleTable/CollapsibleTable";
type CollapsibleTableProps = {
    tasks: any
    currentPage: any
    rowsPerPage: any
    onPageChange: any
    onRowsPerPageChange: any
    handleChangeEdit: any
    handleChangeDelete: any
 }
export const TaskList: React.FC<CollapsibleTableProps> = (props) => {
    const {
        tasks,
        rowsPerPage,
        currentPage,
        onPageChange,
        onRowsPerPageChange,
        handleChangeEdit,
        handleChangeDelete
    } = props
    return (
        <>
           <CollapsibleTable 
                data={tasks}
                pg={currentPage}
                rpg={rowsPerPage}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
                handleChangeEdit={handleChangeEdit}
                handleChangeDeletion={handleChangeDelete}
            />
        </>
    )
}