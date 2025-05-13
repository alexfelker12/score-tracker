import { z } from "zod";

export const userProfileSchema = z.object({
  displayName: z.string().min(1, {
    message: "This field may not be empty"
  }),
  imageFile: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return file.size <= 5 * 1024 * 1024; // 5MB limit
      },
      {
        message: "Image must be less than 5MB",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type);
      },
      {
        message: "Only JPEG, PNG, WEBP and GIF formats are supported",
      }
    ),
})
