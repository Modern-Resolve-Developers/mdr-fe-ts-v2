import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const newCredentialsBaseSchema = z
  .object({
    password: requiredString("Your password is required."),
    conpass: requiredString("Kindly confirm your password."),
  })
  .refine(
    ({ conpass, password }) => {
      return password === conpass;
    },
    { path: ["conpass"], message: "Password is not match" }
  );

export type NewCredentialsAccountCreation = z.infer<
  typeof newCredentialsBaseSchema
>;