import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { Tokens } from "../types";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({ message : 'Method_Not_Allowed'})
    }
    try {
        const result = await client.post<Tokens>('/api/authentication/auth-secure-refresh-token', req.body)
        res.status(200).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler