export type LoginProps = {
    email: string | undefined
    password: string | undefined
}

export type CreateTokenArgs = {
    userId: number | any
    token: any
}

export type CreateAuthHistoryArgs = {
    userId: number | any
    savedAuth: any
    preserve_data: any
    
}

export type AuthenticationJwtCreateAccount = {
    jwtusername: string | undefined
    jwtpassword: string | undefined
    isValid: any
}

export type AuthenticationRefreshTokenArgs = {
    AccessToken: string | undefined
    RefreshToken: string | undefined
}

type VerificationCredentialsProps = {
    email?: string | undefined
    phoneNumber?: string | undefined
}

export type VerificationProps = {
    email: string | undefined;
    code: string | undefined;
    resendCount: number | undefined;
    isValid: number | undefined;
    type: string | undefined;
    verificationCredentials: VerificationCredentialsProps
}

export type BeginToVerifyCode = {
    code: string | undefined
    email: string | undefined
    type: string
}

export type Tokens = {
    AccessToken: string | undefined
    RefreshToken: string | undefined
}

export type RequestRouterParams = {
    requestId: string | undefined
}

export type RequestDeviceRecognition = {
    deviceInfoStringify: string | undefined
    isActive: number
    createdAt: Date
    email: string | undefined
    deviceId?: string | undefined
}

export type TokenStore = {
    email: string | undefined
    AccessToken: string | undefined
    RefreshToken: string | undefined
}