import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const verificationBaseSchema = z.object({
    code: requiredString("Verification code is required"),
  });
  export type VerificationAccountCreation = z.infer<
    typeof verificationBaseSchema
  >;