import { NextApiHandler } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { MigrationReceiver } from "@/utils/sys-routing/sys-routing";

const handler: NextApiHandler = withSsrHttpClient(client => async (req, res) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            message: 'Method_Not_Allowed'
        })
    }
    try {
        const obj: MigrationReceiver = {
            JsonRoutes: req.body
        }
        const result = await client.post<MigrationReceiver>(`/api/users/dynamic-route`, obj)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler