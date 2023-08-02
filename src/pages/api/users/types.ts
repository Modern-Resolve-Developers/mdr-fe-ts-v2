export type UpdateUsersDetailsArgs = {
    id: any | undefined
    firstname: string | undefined
    middlename: string | undefined
    lastname: string | undefined
}

export type UAMAddRequestArgs = {
    firstname: string | undefined
    lastname : string | undefined
    middlename : string | undefined
    email: string | undefined
    password: string | undefined
    userType: string | undefined
    key?: string | undefined
    phoneNumber: string | undefined
}

export type UAMCreationAdminArgs = {
    firstname: string | undefined
    middlename: string | undefined
    lastname: string | undefined
    email: string | undefined
    password: string | undefined
    phoneNumber: string | undefined
}