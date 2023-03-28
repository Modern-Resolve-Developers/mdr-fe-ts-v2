import { AxiosInstance } from 'axios'

import { CreateTask } from '../types'
export class MdrApi {
    constructor(private readonly axios: AxiosInstance){}

    public fetchUsersReport(){
        return this.axios.get('/api/users/find-all-users-report')
    }
    public fetchUsersBasedType(usertype: any){
        return this.axios.get(`/api/Task/fetch-users-based-usertype/${usertype}`)
    }
    public createTask(props : CreateTask) {
        return this.axios.post<CreateTask>('/api/Task/create-task', props)
    }
    public fetchAllTask(){
        return this.axios.get('/api/task/get-all-task')
    }
    public signoutUser(uuid: any){
        return this.axios.put(`/api/token/destroy-signout/${uuid}`)
    }
    public deletionTask(uuid: any){
        return this.axios.delete(`/api/task/delete-ticket/${uuid}`)
    }
    public IdentifyUserTypeFunc(uuid: any) {
        return this.axios.get(`/api/token/identify-user-type/${uuid}`)
    }
}