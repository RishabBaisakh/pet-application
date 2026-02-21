import { z } from "zod";

export const ownerProfileSchema = z.object({
  first_name: z
    .string()
    .nonempty("First name is required")
    .min(1, "First name is required")
    .max(30, "First name must be at most 30 characters"),
  last_name: z
    .string()
    .nonempty("Last name is required")
    .min(1, "Last name is required")
    .max(30, "Last name must be at most 30 characters"),
  bio: z
    .string()
    .max(1000, "Bio must be at most 1000 characters")
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().optional().or(z.literal("")),
});

export type OwnerProfileFormValues = z.infer<typeof ownerProfileSchema>;
