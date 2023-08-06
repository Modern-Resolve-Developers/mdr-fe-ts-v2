import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { CreateAuthHistoryArgs } from "../types";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            message: 'Method_Not_Allowed'
        })
    }
    try {
        const result = await client.post<CreateAuthHistoryArgs>('/api/authhistory/create-auth-history', req.body)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler