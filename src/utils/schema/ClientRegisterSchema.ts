import { z } from "zod";
import { requiredString } from "../formSchema";

const clientRegistrationBaseSchema = z.object({
    firstName: requiredString("Your firstname is required."),
    lastName: requiredString("Your lastname is required"),
    email: requiredString("Your email is required.").email(),
    password: requiredString("Your password is required."),
    conpassword: requiredString("Please confirm your password."),
  });
  
  export const schema = z
    .discriminatedUnion("hasNoMiddleName", [
      z
        .object({
          hasNoMiddleName: z.literal(false),
          middleName: requiredString(
            "Please provide your middlename or select I do not have a middlename"
          ),
        })
        .merge(clientRegistrationBaseSchema),
      z
        .object({
          hasNoMiddleName: z.literal(true),
        })
        .merge(clientRegistrationBaseSchema),
    ])
    .refine(
      ({ conpassword, password }) => {
        return password === conpassword;
      },
      { path: ["conpassword"], message: "Password did not match" }
    );
  export type ClientAccountCreation = z.infer<typeof schema>;