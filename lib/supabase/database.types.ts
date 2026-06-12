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
          bio:         string | null
          created_at:  string
          updated_at:  string
        }
        Insert: {
          id:          string
          email:       string
          full_name?:  string | null
          avatar_url?: string | null
          bio?:        string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?:      string
          full_name?:  string | null
          avatar_url?: string | null
          bio?:        string | null
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
      analytics_events: {
        Row: {
          id:          string
          user_id:     string | null
          event:       string
          properties:  Json
          occurred_at: string
        }
        Insert: {
          id?:         string
          user_id?:    string | null
          event:       string
          properties?: Json
          occurred_at?: string
        }
        Update: {
          properties?: Json
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id:                     string
          user_id:                string
          stripe_customer_id:     string
          stripe_subscription_id: string
          status:                 string
          plan_id:                string
          current_period_start:   string | null
          current_period_end:     string | null
          metadata:               Json
          created_at:             string
          updated_at:             string
        }
        Insert: {
          id?:                     string
          user_id:                 string
          stripe_customer_id:      string
          stripe_subscription_id:  string
          status?:                 string
          plan_id?:                string
          current_period_start?:   string | null
          current_period_end?:     string | null
          metadata?:               Json
          created_at?:             string
          updated_at?:             string
        }
        Update: {
          stripe_customer_id?:     string
          stripe_subscription_id?: string
          status?:                 string
          plan_id?:                string
          current_period_start?:   string | null
          current_period_end?:     string | null
          metadata?:               Json
          updated_at?:             string
        }
        Relationships: []
      }
      beta_waitlist: {
        Row: {
          id:        string
          email:     string
          name:      string | null
          role:      string | null
          invited:   boolean
          joined_at: string
        }
        Insert: {
          id?:       string
          email:     string
          name?:     string | null
          role?:     string | null
          invited?:  boolean
          joined_at?: string
        }
        Update: {
          invited?: boolean
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id:         string
          user_id:    string | null
          type:       string
          message:    string
          page:       string | null
          metadata:   Json
          resolved:   boolean
          created_at: string
        }
        Insert: {
          id?:        string
          user_id?:   string | null
          type?:      string
          message:    string
          page?:      string | null
          metadata?:  Json
          resolved?:  boolean
          created_at?: string
        }
        Update: {
          resolved?: boolean
          metadata?: Json
        }
        Relationships: []
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
  }
}
