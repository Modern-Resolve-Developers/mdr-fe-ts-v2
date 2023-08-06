
import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

const personalBaseSchema = z.object({
    firstName: requiredString("Your firstname is required."),
    lastName: requiredString("Your lastname is required."),
    userType: requiredString("Kindly provide user type."),
  });
  
  export const personalSchema = z.discriminatedUnion("hasNoMiddleName", [
    z
      .object({
        hasNoMiddleName: z.literal(false),
        middleName: requiredString(
          "Please provide your middlename or select i do not have a middlename."
        ),
      })
      .merge(personalBaseSchema),
    z
      .object({
        hasNoMiddleName: z.literal(true),
        middleName: z.string().optional(),
      })
      .merge(personalBaseSchema),
  ]);
  
  export type PersonalAccountCreation = z.infer<typeof personalSchema>;
  