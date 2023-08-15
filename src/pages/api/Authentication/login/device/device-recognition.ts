import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { withSsrHttpClient } from "@/utils/ssr/withSsrHttpClient";
import { RequestDeviceRecognition } from "../../types";

const handler: NextApiHandler = withSsrHttpClient(client => async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method !== 'POST'){
        return res.status(405).json({
            message: 'MethodNotAllowed'
        })
    }
    try {
        const result = await client.post<RequestDeviceRecognition>('/api/users/device-recognition', req.body)
        res.status(result.status).json(result.data)
    } catch (error) {
        console.log(error)
    }
})

export default handler