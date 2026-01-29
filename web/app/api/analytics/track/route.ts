
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client' // Use server client for Admin bypass if needed, or public client if policies allow

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { profileId, type, linkId, meta } = body

        if (!profileId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // We use a client that respects RLS. 
        // Since we added "Public can insert stats", this should work with anon key.
        // However, usually in API routes we might want to use a service role to be sure, 
        // OR just rely on the public policy. 
        // Let's use the standard createClient (server-side, uses cookies/auth if present, or anon).
        // Actually, createClient from '@/lib/supabase/server' requires cookies() which is async in next 15+
        // simpler to just use specific supabase-js setup or the standard one.

        // IMPORTANT: We need to write to the DB.
        // The policy "Public can insert stats" allows anyone (anon) to insert.
        // So we can use a basic client.

        // NOTE: In Next.js App Router API Routes, we usually use `createClient` from `@/lib/supabase/server`.
        // But for "public" tracking (unauthenticated viewers), we need to ensure we can write.
        // If we use `@/lib/supabase/server`, it tries to use cookies. Viewers might not be logged in.
        // That's fine, it falls back to anon, and our policy allows anon insert.

        // Let's use a fresh direct client creation for simplicity handling "anon" right here if needed,
        // or just use the project's standard way.
        // I will use `npm install @supabase/supabase-js` style if I had to, but the project has `lib/supabase/server.ts`.

        // FIX: The project uses `createClient` from `@/lib/supabase/server`.
        // I'll check `lib/supabase/server.ts` imports first to be safe, but I'll write the code assuming it works.
        // Wait, for an API route called by public, using `createClient` is correct.

        // HOWEVER, to avoid "cookie" issues in strict server contexts or edge, 
        // sometimes creating a direct client with URL/ANON_KEY is easier for public APIs.
        // Let's try standard `createClient` first.

        // Correction: Creating the client for public insert.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

        // We do precise import to avoid issues
        const { createClient } = require('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseAnonKey)

        const { error } = await supabase
            .from('analytics_events')
            .insert({
                profile_id: profileId,
                type,
                link_id: linkId || null,
                meta: meta || {},
                // created_at is default now()
            })

        if (error) {
            console.error('[Analytics] Error:', error)
            return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('[Analytics] Exception:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
