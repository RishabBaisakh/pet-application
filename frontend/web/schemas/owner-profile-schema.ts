import { z } from "zod";

export const ownerProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(30, "First name must be at most 30 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(30, "Last name must be at most 30 characters"),
  bio: z
  .string()
  .max(1000, "Bio must be at most 1000 characters")
  .optional(),
  avatarUrl: z.string().optional(),
});

export type OwnerProfileFormValues = z.infer<typeof ownerProfileSchema>;
