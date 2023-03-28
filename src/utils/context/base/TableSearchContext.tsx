import { createContext, useState } from "react";
import { TableSearchContextSetup, TableSearchProps } from "..";

export const TableSearchContextMigrate = createContext<TableSearchContextSetup | null>(null)

type TableSearchChildrenProps = {
    children: React.ReactNode
}

const TableSearchContext: React.FC<TableSearchChildrenProps> = ({ children }) => {
    const [tableSearchList, setTableSearchList] = useState<TableSearchProps[]>([])
    
    return (
        <TableSearchContextMigrate.Provider
        value={{
            tableSearchList, setTableSearchList
        }}
        >{children}</TableSearchContextMigrate.Provider>
    )
}

export default TableSearchContext