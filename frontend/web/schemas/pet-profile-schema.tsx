import { PET_TYPES } from "@/constants/pet";
import { z } from "zod";

const petTypeValues = PET_TYPES.map((t) => t.value) as [string, ...string[]];

export const petProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  type: z.enum(petTypeValues, "Select a valid pet type"),
  breed: z.string().max(50).optional(),
  age: z.number().int().positive().optional(),
  bio: z.string().max(500).optional(),
  avatar_file: z
    .any()
    .refine((files) => files?.length === 1, "Avatar is required")
    .refine(
      (files) =>
        files &&
        ["image/jpeg", "image/png", "image/webp"].includes(files[0]?.type),
      "Only JPEG, PNG, or WEBP allowed",
    ),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
});

export type PetProfileFormValues = z.infer<typeof petProfileSchema>;
