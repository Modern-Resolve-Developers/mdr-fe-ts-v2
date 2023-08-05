import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const taskInformationBaseSchema = z.object({
    title: requiredString("Title is required."),
    description: requiredString("Description is required."),
    imgurl: z.any().optional(),
    priority: requiredString("Kindly set task priority level."),
    subtask: z
      .object({
        task: requiredString("Title is required."),
        priority: requiredString("Kindly set task priority level."),
      })
      .array(),
  });
  
  export type TaskInformationCreation = z.infer<typeof taskInformationBaseSchema>;