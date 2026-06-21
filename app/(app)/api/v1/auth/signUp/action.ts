"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignUpSchema, SignUpIndex } from "@/lib/validations";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  // 1. Convert FormData to an object
  const data = Object.fromEntries(formData.entries());

  // 2. Validate using Zod schema
  const validatedFields = SignUpSchema.safeParse(data);

  if (!validatedFields.success) {
    // Return the error messages to the client component
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password, name }: SignUpIndex = validatedFields.data;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
};
