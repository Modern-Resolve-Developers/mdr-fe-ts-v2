

export type CreateTask = { 
    title: string | undefined
    description: string | undefined
    imgurl: string | undefined
    priority: string | undefined
    subtask: Array<{ task: string, priority: string}> | undefined | any
    assignee_userid: any
    reporter: string | undefined
    task_dept: string | undefined 
    task_status: string | undefined
}

type ProductFeaturesProps = {
    label: string
    value: string
}

export type CreateProducts = {
    productName: string | undefined
    productDescription: string | undefined
    productCategory: string | undefined
    productFeatures: ProductFeaturesProps[]
    projectType: string | undefined
    productImageUrl?: string | undefined
    projectScale: string | undefined
    productPrice: number | undefined
    projectInstallment: string | undefined
    installmentInterest?: number | undefined
    monthsToPay: number | undefined
    downPayment: any | undefined
    monthlyPayment?: any | undefined
    totalPayment?: any | undefined
    repositoryName: string | undefined
    maintainedBy: string | undefined
    repositoryZipUrl?: string | undefined
}

export type JitserStoreDetails = {
    username: string
    roomName: string
    roomPassword: string
    isPrivate: string
}

export type FPChangePasswordProps = {
    email: string | undefined
    newPassword: string | undefined
    currentVerificationCode: string | undefined
}