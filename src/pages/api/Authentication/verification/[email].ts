import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const { email } = req.query
        const result = await client.get<{
            email: string
        }>(`/api/verification/look-resent-load/${email}`)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler