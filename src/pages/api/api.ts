import { MdrApi } from "./mdr/api";
import { UsersApi } from "./users/api";
import { AuthenticationApi } from "./Authentication/api";
export class Api {
    constructor(readonly authentication: AuthenticationApi, readonly mdr: MdrApi, readonly users: UsersApi){}
}