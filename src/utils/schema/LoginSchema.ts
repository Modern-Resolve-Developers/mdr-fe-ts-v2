import { z } from "zod";
import { requiredString } from "../formSchema";

export const LoginSchema = z.object({
    email: requiredString("Your email is required.").email(),
    password: requiredString("Your password is required."),
  });
  
  export type loginAccount = z.infer<typeof LoginSchema>;