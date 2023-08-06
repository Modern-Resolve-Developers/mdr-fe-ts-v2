export type ContextSetup = {
    isHidden: boolean
    setIsHidden: any
    CheckAuthentication: () => Promise<any>
    users: any
    setUsers: any
    callBackSyncGetAllUsers: () => void
    isLoading: boolean
    setLoading: any
}

export type ToastContextSetup = {
    handleOnToast: (
        message: string,
        position: any,
        hideProgressBar: boolean,
        closeOnClick: boolean,
        pauseOnHover: boolean,
        draggable: boolean,
        progress?: any,
        theme?: any,
        type?: any
    ) => void
}

type SessionSavedAuthContextSetup = {
    accessSavedAuth: any
    setAccessSavedAuth: any
    clearAccessSavedAuth: any
}

type SessionUserIdContextSetup = {
    accessUserId: any
    setAccessUserId: any
    clearAccessUserId: any
}

export type TableSearchProps = {
    taskCode: any
    title: string
    description: string
    subtask: any
    imgurl: string
    priority: string
    assignee_userid: any
    reporter: string
    task_dept: string
    task_status: string
    created_by: string
    created_at: any
    updated_at: any
}

export type TableSearchContextSetup = { 
    tableSearchList : any
    setTableSearchList: any
}

export type SessionStorageContextSetup = SessionSavedAuthContextSetup & SessionUserIdContextSetup;