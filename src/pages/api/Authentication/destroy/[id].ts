import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const { id } = req.query
        const result = await client.put(
            `/api/token/destroy-signout/${id}`
        )
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler