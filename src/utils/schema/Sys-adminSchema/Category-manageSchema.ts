import { z } from "zod";
import { requiredString } from "@/utils/formSchema";

export const categoryManagementBaseSchema = z.object({
    label: requiredString("Label is required."),
    type: requiredString("kindly select type."),
  });
  export type categoryManagementCreation = z.infer<
    typeof categoryManagementBaseSchema
  >;