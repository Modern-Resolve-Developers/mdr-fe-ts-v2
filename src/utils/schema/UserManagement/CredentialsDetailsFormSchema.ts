import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const credentialsBaseSchema = z
  .object({
    email: requiredString("Your email is required.").email(),
    password: requiredString("Your password is required."),
    conpassword: requiredString("Please confirm your password."),
  })
  .refine(
    ({ conpassword, password }) => {
      return password === conpassword;
    },
    { path: ["conpassword"], message: "Password did not match" }
  );

export type CredentialsAccountCreation = z.infer<typeof credentialsBaseSchema>;