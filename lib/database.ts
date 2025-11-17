import { createClient } from './supabase/client';

export interface UserProfile {
  id: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResult {
  id: string;
  user_id: string;
  answers: Record<string, number>;
  scores: Record<string, number> | null;
  completed_at: string;
  created_at: string;
}

export interface UserStats {
  email: string;
  full_name: string | null;
  member_since: string;
  assessment_count: number;
  last_assessment: string | null;
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: { full_name?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

// Get user statistics
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const supabase = createClient();

    // Get user data from auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get profile
    const profile = await getUserProfile(userId);

    // Get assessment count
    const { count, error: countError } = await supabase
      .from('assessment_results')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error counting assessments:', countError);
    }

    // Get last assessment date
    const { data: lastAssessment } = await supabase
      .from('assessment_results')
      .select('completed_at')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return {
      email: user.email || '',
      full_name: profile?.full_name || null,
      member_since: profile?.created_at || user.created_at,
      assessment_count: count || 0,
      last_assessment: lastAssessment?.completed_at || null,
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

// Save assessment result
export async function saveAssessmentResult(
  userId: string,
  answers: Record<string, number>,
  scores: Record<string, number>
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('assessment_results')
      .insert({
        user_id: userId,
        answers,
        scores,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving assessment result:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Error saving assessment result:', error);
    return { success: false, error: error.message || 'An error occurred' };
  }
}

// Get user's assessment history
export async function getAssessmentHistory(
  userId: string
): Promise<AssessmentResult[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching assessment history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching assessment history:', error);
    return [];
  }
}

// Get latest assessment result
export async function getLatestAssessment(
  userId: string
): Promise<AssessmentResult | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching latest assessment:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    return null;
  }
}
