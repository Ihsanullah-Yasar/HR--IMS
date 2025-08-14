import z from "zod";

export const userSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
    // image: z
    //   .instanceof(File)
    //   .refine(
    //     (file) => file.size <= 5 * 1024 * 1024,
    //     "Image must be less than 5MB"
    //   )
    //   .refine(
    //     (file) => ["image/jepg", "image/png", "image/webp"].includes(file.type),
    //     "Only .jpg, .png and webp formats are supported"
    //   )
    //   .optional(),
  });
export const userUpdateSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .or(z.literal(""))
      .optional(),
    password_confirmation: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["confirm_password"],
    // image: z
    //   .instanceof(File)
    //   .refine(
    //     (file) => file.size <= 5 * 1024 * 1024,
    //     "Image must be less than 5MB"
    //   )
    //   .refine(
    //     (file) => ["image/jepg", "image/png", "image/webp"].includes(file.type),
    //     "Only .jpg, .png and webp formats are supported"
    //   )
    //   .optional(),
  });

export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
