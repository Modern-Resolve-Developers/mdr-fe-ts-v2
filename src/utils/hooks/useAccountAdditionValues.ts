import { atom } from "jotai";
import { AccountCreation } from "@/pages/create-account";
import { loginAccount } from "@/pages/login";
import { PersonalAccountCreation } from "@/components/UserManagement/forms/PersonalDetailsForms";
import { CredentialsAccountCreation } from "@/components/UserManagement/forms/CredentialsDetailsForms";
import { EditFormUserAccount } from "@/components/UserManagement";
import { TaskInformationCreation } from "@/components/TaskManagement/forms";
import { TaskAssigneeCreation } from "@/components/TaskManagement/forms/TaskAssignee";


type AccountCreationFormData = {
    accountCreation: AccountCreation
}

type AccountLoginFormData = {
    accountLoginFrmData : loginAccount
}


export const taskAssigneeAtom = atom<TaskAssigneeCreation | undefined>(undefined)

export const taskInformationAtom = atom<TaskInformationCreation | undefined>(undefined)

export const personalAccountDetailsAtom = atom<PersonalAccountCreation | undefined>(undefined)

export const editFormUserAccountAtom = atom<EditFormUserAccount | undefined>(undefined)

export const credentialAccountDetailsAtom = atom<CredentialsAccountCreation | undefined>(undefined)

export const accountCreationAtom = atom<AccountCreation | undefined>(undefined)

export const accountLoginAtom = atom<loginAccount | undefined>(undefined)

export const accountAtom = atom(
    (get) => {
        const accountCreation = get(accountCreationAtom)
        return {
            accountCreation
        }
    },
    (_, set, { accountCreation } : AccountCreationFormData) => {
        set(accountCreationAtom, accountCreation)
    }
)

export const loginAtom = atom(
    (get) => {
        const accountLoginFrmData = get(accountLoginAtom)
        return {
            accountLoginFrmData
        }
    },
    (_, set, { accountLoginFrmData } : AccountLoginFormData) => {
        set(accountLoginAtom, accountLoginFrmData)
    }
)