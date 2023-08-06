import { atom } from "jotai";
import { AccountCreation } from "../schema/Create-AccountSchema";
import { loginAccount } from "../schema/LoginSchema";
import { PersonalAccountCreation } from "@/components/UserManagement/forms/PersonalDetailsForms";
import { CredentialsAccountCreation } from "@/components/UserManagement/forms/CredentialsDetailsForms";
import { EditFormUserAccount } from "@/components/UserManagement";

import { ClientAccountCreation } from "../schema/ClientRegisterSchema"; 
import { UserProfileType } from "../schema/UserProfileSchema";
import { ContactType } from "../schema/ContactSchema";
import { VerificationAccountCreation } from "./ForgotPasswordSchema/VerificationDeatilsFormSchema";
import { JoinMeetingFormAccount } from "./Sys-adminSchema/DigitalMeetSchema";
import { EmailAccountCreation } from "./ForgotPasswordSchema/EmailDetailFromSchema";
import { MeetCreation } from "@/components/Jitsi/StartupPage";
import { NewCredentialsAccountCreation } from "./ForgotPasswordSchema/NewCredentialsFormSchema";
import { categoryManagementCreation } from "./Sys-adminSchema/Category-manageSchema";
import { ProductManagementCreation } from "./Sys-adminSchema/Product-ManagementShema";
import { TaskAssigneeCreation } from "./Task-Management/TaskAssigneeSchema";
import { TaskInformationCreation } from "./Task-Management/TaskInformationSchema";

type AccountCreationFormData = {
  accountCreation: AccountCreation;
};

type AccountLoginFormData = {
  accountLoginFrmData: loginAccount;
};

type AccountClientCreationFormData = {
  accountClientCreation: ClientAccountCreation;
};

export const verificationAtom = atom<VerificationAccountCreation | undefined>(
  undefined
);

export const joinMeetAtom = atom<JoinMeetingFormAccount | undefined>(undefined);

export const emailAtom = atom<EmailAccountCreation | undefined>(undefined);

export const meetAtom = atom<MeetCreation | undefined>(undefined);

export const fpIdAtom = atom(0);

export const newCredentialsAtom = atom<
  NewCredentialsAccountCreation | undefined
>(undefined);

export const categoryManagementAtom = atom<
  categoryManagementCreation | undefined
>(undefined);

export const productManagementAtom = atom<
  ProductManagementCreation | undefined
>(undefined);

export const taskAssigneeAtom = atom<TaskAssigneeCreation | undefined>(
  undefined
);

export const taskInformationAtom = atom<TaskInformationCreation | undefined>(
  undefined
);

export const personalAccountDetailsAtom = atom<
  PersonalAccountCreation | undefined
>(undefined);

export const editFormUserAccountAtom = atom<EditFormUserAccount | undefined>(
  undefined
);

export const credentialAccountDetailsAtom = atom<
  CredentialsAccountCreation | undefined
>(undefined);

export const ContactAtom = atom<ContactType | undefined>(undefined)

export const accountCreationAtom = atom<AccountCreation | undefined>(undefined);

export const userProfileAtom = atom<UserProfileType | undefined>(undefined)

export const accountLoginAtom = atom<loginAccount | undefined>(undefined);
export const ClientCreationAtom = atom<ClientAccountCreation | undefined>(
  undefined
);
export const accountClientCreationAtom = atom(
  (get) => {
    const accountClientCreation = get(ClientCreationAtom);
    return {
      accountClientCreation,
    };
  },
  (_, set, { accountClientCreation }: AccountClientCreationFormData) => {
    set(ClientCreationAtom, accountClientCreation);
  }
);
export const accountAtom = atom(
  (get) => {
    const accountCreation = get(accountCreationAtom);
    return {
      accountCreation,
    };
  },
  (_, set, { accountCreation }: AccountCreationFormData) => {
    set(accountCreationAtom, accountCreation);
  }
);

export const loginAtom = atom(
  (get) => {
    const accountLoginFrmData = get(accountLoginAtom);
    return {
      accountLoginFrmData,
    };
  },
  (_, set, { accountLoginFrmData }: AccountLoginFormData) => {
    set(accountLoginAtom, accountLoginFrmData);
  }
);
