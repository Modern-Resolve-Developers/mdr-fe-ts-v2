import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method !== 'POST') {
        return res.status(405).json({
            message: 'Method_Not_Allowed'
        })
    }
    try {
        const {
            jwtusername, jwtpassword
        } = req.body
        const result = await client.post<{
            jwtusername: string | undefined,
            jwtpassword: string | undefined
        }>(`/api/authentication/auth-secure-login/${jwtusername}/${jwtpassword}`)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler