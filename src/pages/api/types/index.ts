

export type CreateTask = { 
    title: string | undefined
    description: string | undefined
    imgurl: string | undefined
    priority: string | undefined
    subtask: Array<{ task: string, priority: string}> | undefined | any
    assignee_userid: any
    reporter: string | undefined
    task_dept: string | undefined 
    task_status: string | undefined
}