import React, { createContext, useContext, useState } from "react";
import { useApiCallBack } from "@/utils/hooks/useApi";
export const MeetContext = createContext<{
    name: string,
    setName: any,
    getAllRooms: () => void,
    rooms : any,
    setRooms: any
}>(undefined as any)

export const MeetProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children    
}) => {
    const [name, setName] = useState("")
    const [rooms, setRooms] = useState([])
    const getRoomList = useApiCallBack(api => api.mdr.GetAllRooms())
    const getAllRooms = () => {
        getRoomList.execute()
        .then((response) => {
            const { data } = response;
            setRooms(data)
        })
    }
    
    return (
        <MeetContext.Provider
        value={{
            name, setName, getAllRooms, rooms, setRooms
        }}
        >{children}</MeetContext.Provider>
    )
}

export const useMeetContext = () => {
    if(!MeetContext){
        throw new Error("Meet Provider should be used")
    }

    return useContext(MeetContext)
}