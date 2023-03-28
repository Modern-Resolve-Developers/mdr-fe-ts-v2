type DataGridRowRequiredData = {
    id: BigInt,
    firstname: string,
    middlename: string,
    lastname: string,
    email: string,
    imgurl: string,
    isstatus: string,
    verified: string,
    userType: any
}
type DataGridRowProps = {
    rowData: DataGridRowRequiredData[]
}

export const rowCreativeDesign = (rowData : any) => {
    let ArrayTemporary = rowData;
    let newArrayTemporary: any[] = [];
    ArrayTemporary?.map((item: any) => {
        newArrayTemporary.push({
            id: item.id,
            firstname: item.firstname,
            middlename: item.middlename,
            lastname: item.lastname,
            email: item.email,
            imgurl: item.imgurl,
            isstatus: item.isstatus,
            verified: item.verified,
            userType : item.userType
        })
    })
    return newArrayTemporary
}