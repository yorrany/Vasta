/// <reference types="@opennextjs/cloudflare" />

interface CloudflareEnv {
  // Add your bindings here
  // KV: KVNamespace;
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
}

declare global {
  interface CloudflareEnv extends CloudflareEnv {}
}
