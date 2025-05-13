import { z } from "zod";

const errorMessages = {
  name: "Name must be at least 3 characters",
  email: "Please enter a valid email address",
  password: "Password must be between 4 and 8 characters",
  acceptTerms: "You must accept the terms and conditions",
};

export const emailSchema = z.string().email({ message: errorMessages.email });

export const passwordSchema = z
  .string()
  .min(4, { message: errorMessages.password })
  .max(8, { message: errorMessages.password });
export const nameScheme = z.string().min(3, errorMessages.name);

export const acceptTermsSchema = z.literal(true, {
  errorMap: () => ({ message: errorMessages.acceptTerms }),
});
