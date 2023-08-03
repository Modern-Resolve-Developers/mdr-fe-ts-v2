import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const { type, email } = req.body
        const result = await client.post<{
            type: string, email: string | undefined
        }>(`/api/verification/resend-verification-code/${type}/${email}`)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler