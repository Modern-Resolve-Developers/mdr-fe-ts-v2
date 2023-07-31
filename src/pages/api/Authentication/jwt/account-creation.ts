import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { AuthenticationJwtCreateAccount } from "../types";

const handler : NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const result = await client.post<AuthenticationJwtCreateAccount>(`/api/authentication/auth-secure-register`, req.body)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler