import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// Update password
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // 1. Verify the user is logged in
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized. Please sign in." },
      { status: 401 },
    );
  }

  // 2. Parse the incoming request body
  const body = await req.json();
  const { password } = body;

  if (!password || password.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Password cannot be empty." },
      { status: 400 },
    );
  }

  // 3. Update the user's metadata in Supabase
  const { error: updateError } = await supabase.auth.updateUser({
     password: password,
  });

  if (updateError) {
    return NextResponse.json(
      { success: false, message: updateError.message },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Keycode updated successfully! 🔒",
  });
};

