import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database Types (will be generated from Supabase CLI or defined manually)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          updated_at?: string
        }
      }
      transcripts: {
        Row: {
          id: string
          meeting_id: string
          speaker_name: string | null
          content: string
          timestamp: number
          confidence: number | null
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          speaker_name?: string | null
          content: string
          timestamp: number
          confidence?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          speaker_name?: string | null
          content?: string
          timestamp?: number
          confidence?: number | null
        }
      }
      action_items: {
        Row: {
          id: string
          meeting_id: string
          task: string
          assignee: string | null
          due_date: string | null
          status: 'pending' | 'in_progress' | 'completed'
          priority: 'low' | 'medium' | 'high'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          task: string
          assignee?: string | null
          due_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          task?: string
          assignee?: string | null
          due_date?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          priority?: 'low' | 'medium' | 'high'
          updated_at?: string
        }
      }
    }
  }
}