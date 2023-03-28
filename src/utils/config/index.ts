import getConfig from "next/config";

const {
    publicRuntimeConfig: { processEnv }
} = getConfig()

export const config = {
    get value(){
        return {
            TENANT_URL: process.env.NEXT_PUBLIC_BASEURL,
            AUTH_TOKEN: process.env.NEXT_PUBLIC_SUPPRESS_TOKEN,
            PROD_URL: process.env.NEXT_PUBLIC_TENANT_URL
        }
    }
}