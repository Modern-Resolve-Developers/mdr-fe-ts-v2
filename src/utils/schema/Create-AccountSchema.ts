import { z } from "zod";
import { requiredString } from "../formSchema";

const baseSchema = z.object({
  firstName: requiredString("Your firstname is required."),
  lastName: requiredString("Your lastname is required."),
  email: requiredString("Your email is required.").email(),
  password: requiredString("Your password is required."),
  conpassword: requiredString("Please confirm your password."),
  phoneNumber: requiredString("Your phone number is required.")
});


export const schema = z
  .discriminatedUnion("hasNoMiddleName", [
    z
      .object({
        hasNoMiddleName: z.literal(false),
        middleName: requiredString(
          "Please provide your middlename or select i do not have a middlename"
        ),
      })
      .merge(baseSchema),
    z
      .object({
        hasNoMiddleName: z.literal(true),
      })
      .merge(baseSchema),
  ])
  .refine(
    ({ conpassword, password }) => {
      return password === conpassword;
    },
    { path: ["conpassword"], message: "Password did not match" }
  );


export type AccountCreation = z.infer<typeof schema>;
