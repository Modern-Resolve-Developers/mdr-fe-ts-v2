import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    try {
        const result = await client.get(`/api/users/account-setup-checker`)
        res.status(200).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler