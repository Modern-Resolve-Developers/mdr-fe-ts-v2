export type LoginProps = {
    email: string
    password: string
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
    jwtusername: any
    jwtpassword: any
    isValid: any
}

export type AuthenticationRefreshTokenArgs = {
    AccessToken: string | undefined
    RefreshToken: string | undefined
}