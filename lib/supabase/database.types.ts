export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:          string
          email:       string
          full_name:   string | null
          avatar_url:  string | null
          created_at:  string
          updated_at:  string
        }
        Insert: {
          id:          string
          email:       string
          full_name?:  string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?:      string
          full_name?:  string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      dna_assessments: {
        Row: {
          id:           string
          user_id:      string
          answers:      Json
          completed:    boolean
          completed_at: string | null
          created_at:   string
          updated_at:   string
        }
        Insert: {
          id?:          string
          user_id:      string
          answers?:     Json
          completed?:   boolean
          completed_at?: string | null
          created_at?:  string
          updated_at?:  string
        }
        Update: {
          answers?:     Json
          completed?:   boolean
          completed_at?: string | null
          updated_at?:  string
        }
        Relationships: []
      }
      creator_profiles: {
        Row: {
          id:                 string
          user_id:            string
          archetype:          string | null
          category:           string | null
          title:              string | null
          brand_identity:     Json
          strengths:          Json
          audience_profile:   Json
          speaking_topics:    string[]
          visibility_score:   number
          ai_alignment_score: number
          raw_dna_data:       Json
          created_at:         string
          updated_at:         string
        }
        Insert: {
          id?:                 string
          user_id:             string
          archetype?:          string | null
          category?:           string | null
          title?:              string | null
          brand_identity?:     Json
          strengths?:          Json
          audience_profile?:   Json
          speaking_topics?:    string[]
          visibility_score?:   number
          ai_alignment_score?: number
          raw_dna_data?:       Json
          created_at?:         string
          updated_at?:         string
        }
        Update: {
          archetype?:          string | null
          category?:           string | null
          title?:              string | null
          brand_identity?:     Json
          strengths?:          Json
          audience_profile?:   Json
          speaking_topics?:    string[]
          visibility_score?:   number
          ai_alignment_score?: number
          raw_dna_data?:       Json
          updated_at?:         string
        }
        Relationships: []
      }
      saved_podcasts: {
        Row: {
          id:           string
          user_id:      string
          podcast_id:   string
          podcast_data: Json
          saved_at:     string
        }
        Insert: {
          id?:          string
          user_id:      string
          podcast_id:   string
          podcast_data: Json
          saved_at?:    string
        }
        Update: {
          podcast_data?: Json
        }
        Relationships: []
      }
      match_history: {
        Row: {
          id:          string
          user_id:     string
          podcast_id:  string
          match_score: number
          match_data:  Json
          viewed_at:   string | null
          saved:       boolean
          created_at:  string
        }
        Insert: {
          id?:         string
          user_id:     string
          podcast_id:  string
          match_score: number
          match_data:  Json
          viewed_at?:  string | null
          saved?:      boolean
          created_at?: string
        }
        Update: {
          match_score?: number
          match_data?:  Json
          viewed_at?:   string | null
          saved?:       boolean
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          id:                    string
          user_id:               string
          profile_settings:      Json
          notification_settings: Json
          creator_preferences:   Json
          account_settings:      Json
          updated_at:            string
        }
        Insert: {
          id?:                    string
          user_id:                string
          profile_settings?:      Json
          notification_settings?: Json
          creator_preferences?:   Json
          account_settings?:      Json
          updated_at?:            string
        }
        Update: {
          profile_settings?:      Json
          notification_settings?: Json
          creator_preferences?:   Json
          account_settings?:      Json
          updated_at?:            string
        }
        Relationships: []
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
  }
}
