import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { BeginToVerifyCode } from "../types";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method != 'POST'){
        return res.status(405).json({
            message: 'MethodNowAllowed'
        })
    }
    try {
        const data = req.body as BeginToVerifyCode
        const result = await client.post<BeginToVerifyCode>(`/api/verification/check-verification-code/${data.code}/${data.email}/${data.type}`)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler