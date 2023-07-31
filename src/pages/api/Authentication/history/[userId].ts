import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const { userId } = req.query
        const result = await client.get<{
            userId: number
        }>(`/api/authhistory/fetch-created-auth-history/${userId}`)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler