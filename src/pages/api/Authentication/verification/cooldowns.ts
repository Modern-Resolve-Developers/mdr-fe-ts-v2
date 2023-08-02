import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method !== 'POST') {
        return res.status(401).json({
            message: 'Method_Not_Allowed'
        })
    }
    try {
        const result = await client.post('/api/verification/create-required-verification-cooldowns', req.body)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler