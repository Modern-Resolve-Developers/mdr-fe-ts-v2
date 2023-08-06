import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { VerificationProps } from "../types";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({ message : 'Method_Not_Allowed'})
    }
    try {
        const data = req.body;
        const result = await client.post<VerificationProps>(`/api/verification/send-verification-code/${data.verificationCredentials.email}/${data.verificationCredentials.phoneNumber}`, data)
        res.status(200).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler