import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const emailBaseSchema = z.object({
    email: requiredString("Email is required").email(),
  });
  export type EmailAccountCreation = z.infer<typeof emailBaseSchema>;