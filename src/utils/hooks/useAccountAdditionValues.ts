import { atom } from "jotai";
import { AccountCreation } from "../schema/Create-AccountSchema"; 
import { loginAccount } from "../schema/LoginSchema";
import { PersonalAccountCreation } from "../schema/UserManagement/PersonalDetailsFormSchema";
import { CredentialsAccountCreation } from "../schema/UserManagement/CredentialsDetailsFormSchema";
import { EditFormUserAccount } from "@/components/UserManagement";
import { TaskInformationCreation } from "../schema/Task-Management/TaskInformationSchema";
import { TaskAssigneeCreation } from "../schema/Task-Management/TaskAssigneeSchema";
import { ProductManagementCreation } from "../schema/Sys-adminSchema/Product-ManagementShema";
import { categoryManagementCreation } from "../schema/Sys-adminSchema/Category-manageSchema"; 
import { MeetCreation } from "@/components/Jitsi/StartupPage";
import { EmailAccountCreation } from "../schema/ForgotPasswordSchema/EmailDetailFromSchema";
import { VerificationAccountCreation } from "../schema/ForgotPasswordSchema/VerificationDeatilsFormSchema";
import { NewCredentialsAccountCreation } from "../schema/ForgotPasswordSchema/NewCredentialsFormSchema";
import { JoinMeetingFormAccount } from "../schema/Sys-adminSchema/DigitalMeetSchema";
import { ClientAccountCreation } from "../schema/ClientRegisterSchema"; 
import { UserProfileType } from "../schema/UserProfileSchema";
import { ContactType } from "../schema/ContactSchema";
import { VerifyType } from "../schema/VerifySchema";

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

export const verifyAtom = atom<VerifyType | undefined>(undefined)

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
