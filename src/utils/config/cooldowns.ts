
export type CooldownsEntity = {
    resendCount: number
    cooldown: number
}

export const cooldownsToBeMigrated: CooldownsEntity = {
    resendCount: 3,
    cooldown: 5000
}