import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const taskAssigneeBaseSchema = z.object({
    assignee: requiredString("Please select assignee."),
    reporter: requiredString("Please select reporter."),
    task_dept: requiredString("Please select task department."),
    task_status: requiredString("Please provide status."),
  });
  
  export type TaskAssigneeCreation = z.infer<typeof taskAssigneeBaseSchema>;