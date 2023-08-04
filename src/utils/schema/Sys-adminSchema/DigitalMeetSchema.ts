import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const baseJoinFormSchema = z.object({
    name: requiredString("Your name is required"),
    password: z.string().optional(),
  });
  
  export type JoinMeetingFormAccount = z.infer<typeof baseJoinFormSchema>;