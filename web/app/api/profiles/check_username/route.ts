
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // Create admin client to bypass RLS for availability check, 
  // or use anon key if RLS allows reading 'username' column publicly.
  // Assuming 'profiles' table is publicly readable for usernames (standard for link-in-bio).
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "The result contains 0 rows", which means available.
    // Any other error is a real problem.
    console.error("Supabase Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If data exists, username is taken.
  const isTaken = !!data;
  
  if (isTaken) {
      return NextResponse.json({ 
          available: false,
          suggestions: [
              `${username}pro`,
              `${username}hq`,
              `sou${username}`,
              `${username}.br`
          ]
      });
  }

  return NextResponse.json({ available: true });
}
