import axios from 'axios'

const danjAPI = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASEURL,
    headers: {}
})

const private_api = process.env.NEXT_PUBLIC_BASEURL

export enum Methods {
    POST = 'POST' as any,
    GET = 'GET'as any,
    PUT = 'PUT'as any,
    DELETE = 'DELETE'as any
}

type HttpRequestConfig = {
    PropsType: any
    RequestMethod: any
    Body?: any
}

type HttpConfig = {
    combinationUrl: string
    HttpRequest: HttpRequestConfig
}

export const buildHttp = (http: HttpConfig) => {
    const { combinationUrl, HttpRequest } = http
    const { PropsType, RequestMethod, Body = null } = HttpRequest
    const headersConfig = {
        "Content-Type" : "application/json",
        "x-api-key" : "34a89f9063bb49a59d2525220b677e25"
    }
    var data = new FormData()
    return new Promise((resolve: any) => {
        switch(PropsType){
            case '[Request][FromBody]':
                for(const props in Body){
                    data.append(`${props}`, `${Body[props]}`)
                }
                axios({
                    method: Methods[RequestMethod],
                    url: private_api + combinationUrl,
                    headers : headersConfig,
                    data: Body != null && data
                }).then((response: any) => resolve(response))
                break;
            case '[Request][FromRoute]':
                axios({
                    method: Methods[RequestMethod],
                    url: private_api + combinationUrl,
                    headers : headersConfig,
                }).then((response: any) => resolve(response))
                break;
            case '[Request][FromBody][Raw]':
                axios({
                    method: Methods[RequestMethod],
                    url: private_api + combinationUrl,
                    headers : headersConfig,
                    data: Body
                }).then((response: any) => resolve(response))
                break;
            default:
                resolve("nothing")
                break;
        }
    })
}