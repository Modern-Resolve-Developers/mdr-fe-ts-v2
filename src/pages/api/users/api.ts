import { AxiosInstance } from 'axios'
import { UpdateUsersDetailsArgs, UAMAddRequestArgs,UAMCreationAdminArgs } from './types'

export class UsersApi {
    constructor(private readonly axios: AxiosInstance){}
    public fetchAllUsersFunc(){
        return this.axios.get('/api/users/get-all-users')
    }
    public UpdateUsersDetailsFunc(props : UpdateUsersDetailsArgs){
        return this.axios.put('/api/users/update-users-personal-details', props)
    }
    public UpdateUsersVerifiedStatusFunc(props: {identifier: any, uuid: any}) {
        const {
            identifier, uuid
        } = props
        return this.axios.put(`/api/users/update-users-verified-status/${identifier}/${uuid}`)
    }
    public UAMAddUsersFunc(props : UAMAddRequestArgs){
        return this.axios.post('/api/users/uam-add', props)
    }
    public UAMCreateAdmin(props: UAMCreationAdminArgs){
        return this.axios.post('/api/users/add-admin', props)
    }
    public UAMCheckAccounts(randomNum: Number){
        return this.axios.get(`/api/users/check-email/${randomNum}`)
    }
    public UAMCheckEmail(email: string){
        return this.axios.get(`/api/users/uam-check-email/${email}`)
    }
    public SetupAccountCreationCheckEmail(email: string){
        return this.axios.get(`/api/users/uam-check-email-setup/${email}`)
    }
    public AccountDeletion(uid: number){
        return this.axios.delete(`/api/users/temp-delete-uam-user/${uid}`)
    }
}