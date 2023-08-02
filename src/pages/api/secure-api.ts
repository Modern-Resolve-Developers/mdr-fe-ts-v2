import { ServerLessApi } from "./Serverless/api";

export class SecureApi {
    constructor(readonly secure: ServerLessApi){}
}