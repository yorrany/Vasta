
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Simple in-memory rate store (Map<IP, Timestamp[]>)
// Note: In serverless environments, this memory is volatile and per-instance.
// Ideally usage of Redis/Upstash is recommended for distributed rate limiting.
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 15; // Max 15 checks per minute per IP

function getRateLimitStatus(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  const requestTimestamps = rateLimitMap.get(ip) || [];
  
  // Filter out requests older than the window
  const recentRequests = requestTimestamps.filter(timestamp => timestamp > windowStart);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limit exceeded
  }

  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  // Cleanup old entries periodically (simple garbage collection on write)
  if (rateLimitMap.size > 1000) {
      rateLimitMap.clear(); 
  }

  return true; // Allowed
}

// Utility to sleep for a random duration (Tarpit strategy)
const randomDelay = (min: number, max: number) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

export async function GET(request: Request) {
  // 1. Get Client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

  // 2. Check Rate Limit
  if (ip !== "unknown" && !getRateLimitStatus(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  // 3. Strict Input Validation (Fail fast)
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  // Regex: Only alphanumeric, underscores, dots, hyphens. Min 3 chars.
  const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
  if (!usernameRegex.test(username)) {
      return NextResponse.json({ available: false, message: "Invalid format" }); // Don't even check DB
  }

  // 4. Artificial Delay (200ms - 800ms)
  // Mask DB latency and slow down brute-force scripts
  await randomDelay(200, 800);

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
    console.error("Supabase Error:", error);
    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }

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
