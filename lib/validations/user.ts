import { z } from "zod";

export const CreateProfileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 character")
        .max(50, "Name cannot exceed 50 characters")
        .optional(),

    avtarUrl: z
        .url("Invalid avatar URL")    
        .optional()
        .or(z.literal("")),
});


export const UpdateSettingSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),

  editorFontSize: z.number().min(1).max(32).optional(),

  sidebarCollapsed: z.boolean().optional(),

  markdownPreview: z
  .boolean()
  .optional(),
});

export const UserParamsSchema = z.object({
    id: z.uuid("Invalid user id")
});


export type CreateProfileIndex = z.infer<typeof CreateProfileSchema>;
export type UpdateSettingIndex = z.infer<typeof UpdateSettingSchema>;
export type UserParamsIndex = z.infer<typeof UserParamsSchema>;