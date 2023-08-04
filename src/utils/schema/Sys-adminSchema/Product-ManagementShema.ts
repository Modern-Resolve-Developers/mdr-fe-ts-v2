import { requiredString } from "@/utils/formSchema";
import { z } from "zod";

export const productManagementBaseSchema = z.object({
    productName: requiredString("Product name is required."),
    productDescription: requiredString("Product Description is required."),
    productCategory: requiredString("Kindly select product category."),
    projectType: requiredString("Kindly select project type"),
    productFeatures: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .array(),
    productImage: z.string().optional(),
    projectScale: requiredString("Kindly select project scale."),
    productPrice: z.any(),
    installment: requiredString("Please select installment"),
    installmentInterest: z
      .any({ required_error: "Kindly select interest percentage" })
      .optional(),
    downpaymentRequired: z.any().optional(),
    monthlyPaymentSelection: z
      .any({ required_error: "Kindly select monthly payment selection" })
      .optional(),
    monthlyPaymentRequired: z.any().optional(),
    totalAmountBasedOnInstallation: z.any().optional(),
    // product repository
    repositoryName: requiredString("Repository Name is required."),
    repositoryMaintainedBy: requiredString("Select team"),
    repositoryUrl: z.string().optional(),
  });
  export type ProductManagementCreation = z.infer<
    typeof productManagementBaseSchema
  >;