import { z } from "zod";
import { requiredString } from "../formSchema";

export const ContactSchema = z.object({
    firstname: requiredString('Your firstname is required.'),
    lastname: requiredString('Your lastname is required.'),
    email: requiredString('Email is required.').email(),
    phoneNumber: requiredString('Your mobile number is required.'),
    systems: z.object({
        value: z.string(),
        label: z.string()
    }).array(),
    message: z.string().optional()
})

export type ContactType = z.infer<typeof ContactSchema>