import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('[DEBUG] Attempting sign in for:', email);

    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[DEBUG] Sign in error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        error_code: error.code,
        error_status: error.status,
      }, { status: 400 });
    }

    console.log('[DEBUG] Sign in successful, user ID:', data.user?.id);

    // Check if user_profiles table exists and is accessible
    let profileCheck = { exists: false, accessible: false, error: null as any };
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .eq('id', data.user!.id)
        .single();

      if (profileError) {
        profileCheck.error = profileError.message;
        console.error('[DEBUG] Profile check error:', profileError);
      } else {
        profileCheck.exists = true;
        profileCheck.accessible = true;
        console.log('[DEBUG] Profile found:', profile);
      }
    } catch (e: any) {
      profileCheck.error = e.message;
      console.error('[DEBUG] Profile check exception:', e);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
      session: {
        access_token: data.session?.access_token?.substring(0, 20) + '...',
        expires_at: data.session?.expires_at,
      },
      profile_check: profileCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[DEBUG] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack,
    }, { status: 500 });
  }
}
