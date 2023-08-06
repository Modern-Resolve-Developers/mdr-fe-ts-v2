import { z } from "zod";
import { requiredString } from "../formSchema";

export const UserProfileBaseSchema = z.object({
    firstname: requiredString('Firstname is required.'),
    lastname: requiredString('Lastname is required.'),
    email: requiredString('Email is required.').email(),
    profileImage: z.string().optional()
})

export const UserProfileSchema = z.discriminatedUnion('hasNoMiddleName', [
    z.object({
        hasNoMiddleName: z.literal(false),
        middlename: requiredString('Please provide your middlename or select i do not have a middlename.')
    }).merge(UserProfileBaseSchema),
    z.object({
        hasNoMiddleName: z.literal(true),
        middlename: z.string().optional()
    }).merge(UserProfileBaseSchema)
])

export type UserProfileType = z.infer<typeof UserProfileSchema>