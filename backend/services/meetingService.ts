import { supabase } from '../config/supabase'
import type { Database } from '../config/supabase'

type MeetingRow = Database['public']['Tables']['meetings']['Row']
type MeetingInsert = Database['public']['Tables']['meetings']['Insert']
type MeetingUpdate = Database['public']['Tables']['meetings']['Update']

type TranscriptRow = Database['public']['Tables']['transcripts']['Row']
type TranscriptInsert = Database['public']['Tables']['transcripts']['Insert']

type ActionItemRow = Database['public']['Tables']['action_items']['Row']
type ActionItemInsert = Database['public']['Tables']['action_items']['Insert']
type ActionItemUpdate = Database['public']['Tables']['action_items']['Update']

export interface Meeting extends MeetingRow {}
export interface Transcript extends TranscriptRow {}
export interface ActionItem extends ActionItemRow {}

class MeetingService {
  /**
   * Create a new meeting
   */
  async createMeeting(meeting: Omit<MeetingInsert, 'user_id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('meetings')
        .insert({ ...meeting, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating meeting:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Get all meetings for the current user
   */
  async getMeetings(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('start_time', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching meetings:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Get a specific meeting by ID
   */
  async getMeeting(meetingId: string) {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', meetingId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching meeting:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Update a meeting
   */
  async updateMeeting(meetingId: string, updates: MeetingUpdate) {
    try {
      const { data, error } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', meetingId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating meeting:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Delete a meeting
   */
  async deleteMeeting(meetingId: string) {
    try {
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error deleting meeting:', error)
      return { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Add transcript entries for a meeting
   */
  async addTranscript(transcript: Omit<TranscriptInsert, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('transcripts')
        .insert(transcript)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error adding transcript:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Get transcripts for a meeting
   */
  async getTranscripts(meetingId: string) {
    try {
      const { data, error } = await supabase
        .from('transcripts')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('timestamp', { ascending: true })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching transcripts:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Create an action item for a meeting
   */
  async createActionItem(actionItem: Omit<ActionItemInsert, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('action_items')
        .insert(actionItem)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating action item:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Get action items for a meeting
   */
  async getActionItems(meetingId: string) {
    try {
      const { data, error } = await supabase
        .from('action_items')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: true })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching action items:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Update an action item
   */
  async updateActionItem(actionItemId: string, updates: ActionItemUpdate) {
    try {
      const { data, error } = await supabase
        .from('action_items')
        .update(updates)
        .eq('id', actionItemId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating action item:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Delete an action item
   */
  async deleteActionItem(actionItemId: string) {
    try {
      const { error } = await supabase
        .from('action_items')
        .delete()
        .eq('id', actionItemId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error deleting action item:', error)
      return { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }

  /**
   * Get meeting summary with transcripts and action items
   */
  async getMeetingWithDetails(meetingId: string) {
    try {
      // Get meeting details
      const meetingResult = await this.getMeeting(meetingId)
      if (meetingResult.error) throw new Error(meetingResult.error)

      // Get transcripts and action items in parallel
      const [transcriptsResult, actionItemsResult] = await Promise.all([
        this.getTranscripts(meetingId),
        this.getActionItems(meetingId)
      ])

      if (transcriptsResult.error) throw new Error(transcriptsResult.error)
      if (actionItemsResult.error) throw new Error(actionItemsResult.error)

      return {
        data: {
          meeting: meetingResult.data,
          transcripts: transcriptsResult.data,
          actionItems: actionItemsResult.data
        },
        error: null
      }
    } catch (error) {
      console.error('Error fetching meeting details:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      }
    }
  }
}

export const meetingService = new MeetingService()