import { AxiosInstance } from "axios";
import { AuthenticationJwtCreateAccount, BeginToVerifyCode, CreateAuthHistoryArgs, CreateTokenArgs, LoginProps, RequestDeviceRecognition, RequestRouterParams, TokenStore, Tokens, VerificationProps } from "../Authentication/types";
import { RouteEntity } from "@/utils/sys-routing/sys-routing";

export class ServerLessApi {
    constructor(private readonly axios: AxiosInstance){}
    public destroyWhenStorageEmpty(id: number) {
        return this.axios.get(`/Authentication/destroy/${id}`)
    }
    public sla_jwt_account_creation(props: AuthenticationJwtCreateAccount){
        return this.axios.post(`/Authentication/jwt/account-creation`, props)
    }
    public sla_send_verification_code_securely(props: VerificationProps){
        return this.axios.post(`/Authentication/verification/send-code-securely`, props)
    }
    public sla_begin_checking_verification_code(props: BeginToVerifyCode){
        return this.axios.post(`/Authentication/verification/verify-code`, props)
    }
    public sla_begin_work_refresh_tokens(props: Tokens){
        return this.axios.post('/Authentication/jwt/keep-alive', props)
    }
    public sla_begin_work_find_secured_route(id: string | undefined){
        return this.axios.get(`/Authentication/router/${id}`)
    }
    public sla_begin_work_login(props: LoginProps){
        return this.axios.post(`/Authentication/login/login`, props)
    }
    public sla_begin_work_create_token(props: CreateTokenArgs){
        return this.axios.post('/Authentication/jwt/create-token', props)
    }
    public sla_begin_work_create_auth_history(props: CreateAuthHistoryArgs){
        return this.axios.post('/Authentication/history/create-auth-history', props)
    }
    public sla_begin_work_login_jwt(props: {
        jwtusername: string | undefined,
        jwtpassword: string | undefined
    }){
        return this.axios.post('/Authentication/jwt/login', props)
    }
    public sla_begin_fetching_saved_histories(userId: number){
        return this.axios.get(`/Authentication/history/${userId}`)
    }
    public sla_begin_resending_code(props: {type: string, email: string | undefined}){
        return this.axios.post(`/Authentication/verification/resend-code`, props)
    }
    public sla_begin_checking_resent_code(email: string | undefined){
        return this.axios.get(`/Authentication/verification/${email}`)
    }
    public sla_begin_revalidate_resent_code(email: string | undefined){
        return this.axios.put(`/Authentication/verification/validate/${email}`)
    }
    public sla_begin_device_recognition(props: RequestDeviceRecognition){
        return this.axios.post('/Authentication/login/device/device-recognition', props)
    }
}