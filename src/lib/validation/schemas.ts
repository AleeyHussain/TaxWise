import { z } from "zod";
import { questionnaireAnswersSchema } from "./answers";

export { questionnaireAnswersSchema };

export const assistantRequestSchema = z.object({
  question: z.string().trim().min(1, "Please enter a question.").max(2000),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

export type AssistantRequestInput = z.infer<typeof assistantRequestSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
