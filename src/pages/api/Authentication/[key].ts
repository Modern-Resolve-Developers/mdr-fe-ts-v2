import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";


const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const { key } = req.query
        const result = await client.get(
            `/api/token/identify-user-type/${key}`
        )
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler