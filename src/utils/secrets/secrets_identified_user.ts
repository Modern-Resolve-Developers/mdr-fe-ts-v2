import { config } from "../config";

export async function getSecretsIdentifiedAccessLevel(uuid: number){
    const response = await fetch(
        `${config.value.SELF_URI}/Authentication/${uuid}`,
        {
            headers: {
                "Content-Type": "application/json",
                "x-api-key" : config.value.AUTH_TOKEN
            }
        }
    )

    return ((await response.json()) ?? null)
}