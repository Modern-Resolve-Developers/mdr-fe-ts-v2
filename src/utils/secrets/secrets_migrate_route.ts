import { config } from "../config";
import { MigrationReceiver } from "../sys-routing/sys-routing";

export async function workWithMigrationRouter(migrate: MigrationReceiver){
    const response = await fetch(
        `${config.value.SELF_URI}/Authentication/router/migration-router`,
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": config.value.AUTH_TOKEN as string
            },
            body: JSON.stringify(migrate.JsonRoutes)
        },
    )

    return ((await response.json() ?? null))
}

export async function workWithAccountSetup(){
    const response = await fetch(
        `${config.value.SELF_URI}/Authentication/setup/setup-scan`,
        {
            headers:{
                "Content-Type": "application/json",
                "x-api-key": config.value.AUTH_TOKEN as string
            }
        }
    )
    return ((await response.json() ?? null))
}