import { PET_TYPES } from "@/constants/pet";
import { z } from "zod";

const petTypeValues = PET_TYPES.map((t) => t.value) as [string, ...string[]];

export const petProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be at most 50 characters"),
  type: z
    .enum(petTypeValues, "Select a valid pet type"),
  breed: z
    .string()
    .max(50, "Breed must be at most 50 characters")
    .optional(),
  age: z
    .number()
    .int()
    .positive()
    .optional(),
  bio: z
    .string()
    .max(1000, "Bio must be at most 1000 characters")
    .optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  avatarUrl: z.string().optional(),
});

export type PetProfileFormValues = z.infer<typeof petProfileSchema>;
