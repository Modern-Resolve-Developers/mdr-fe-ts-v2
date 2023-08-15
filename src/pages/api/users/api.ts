import { AxiosInstance } from 'axios'
import { UpdateUsersDetailsArgs, UAMAddRequestArgs,UAMCreationAdminArgs } from './types'
import { RequestDeviceRecognition } from '../Authentication/types'

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
    public GoogleCheckAccounts(email: string) {
        return this.axios.get(`/api/users/google-check-verify/${email}`)
    }
    public CustomerAccountCreation(props : UAMAddRequestArgs) {
        return this.axios.post(`/api/users/customer-account-creation/${props.key}`, props)
    }
    public findEmailOnCustomerRegistration(email: string) {
        return this.axios.get(`/api/users/customer-check-email/${email}`)
    }
    public deviceRequestUpdate(email: string | undefined) {
        return this.axios.put(`/api/users/device-request/${email}`)
    }
    public deviceGetRequest(deviceId: string | undefined) {
        return this.axios.get(
            `/api/users/device-get-request/${deviceId}`
        )
    }
    public demolishDeviceRequest(email: string | undefined) {
        return this.axios.put(`/api/users/demolish-device-request/${email}`)
    }
    public revokeDevice(email: string){
        return this.axios.put(`/api/users/device-revoke/${email}`)
    }
    public unauthRevokeDevice(email: string) {
        return this.axios.put(`/api/users/unauth-device-revoke/${email}`)
    }
    public authDeviceApproval(props: {deviceId?: string | undefined, email: string}){
        return this.axios.put(`/api/users/device-approval/${props.deviceId}/auth/${props.email}`)
    }
    public approvedDeviceTriggered(email: string) {
        return this.axios.get(`/api/users/approved-device/${email}/trigger`)
    }
    public approvedDeviceReset(email: string) {
        return this.axios.put(`/api/users/approved-device/${email}/reset`)
    }
}