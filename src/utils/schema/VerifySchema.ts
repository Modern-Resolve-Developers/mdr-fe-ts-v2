import { z } from "zod";
import { requiredString } from "../formSchema";

export const VerifyBase = z.object({
    code : requiredString('Please provide the verification code.')
})

export type VerifyType = z.infer<typeof VerifyBase>