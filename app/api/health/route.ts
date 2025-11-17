import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    status: 'ok',
    env_check: {
      supabase_url_configured: !!supabaseUrl,
      supabase_url_value: supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET',
      supabase_key_configured: !!supabaseAnonKey,
      supabase_key_prefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET',
    },
    timestamp: new Date().toISOString(),
  });
}
