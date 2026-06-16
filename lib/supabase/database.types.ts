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
      outreach_log: {
        Row: {
          id:                   string
          user_id:              string
          podcast_id:           string
          podcast_name:         string
          contact_method_rank:  number
          contact_value:        string | null
          contacted_at:         string
          followed_up:          boolean
          followed_up_at:       string | null
          got_response:         boolean
          got_response_at:      string | null
          got_booked:           boolean
          got_booked_at:        string | null
          notes:                string | null
          created_at:           string
        }
        Insert: {
          id?:                  string
          user_id:              string
          podcast_id:           string
          podcast_name:         string
          contact_method_rank:  number
          contact_value?:       string | null
          contacted_at?:        string
          followed_up?:         boolean
          followed_up_at?:      string | null
          got_response?:        boolean
          got_response_at?:     string | null
          got_booked?:          boolean
          got_booked_at?:       string | null
          notes?:               string | null
          created_at?:          string
        }
        Update: {
          followed_up?:         boolean
          followed_up_at?:      string | null
          got_response?:        boolean
          got_response_at?:     string | null
          got_booked?:          boolean
          got_booked_at?:       string | null
          notes?:               string | null
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          // ── Identity ────────────────────────────────────────────
          id:                          string
          slug:                        string
          // ── Basic metadata ──────────────────────────────────────
          podcast_name:                string
          host_name:                   string
          co_host_name:                string | null
          description:                 string | null
          artwork_url:                 string | null
          // ── Taxonomy ────────────────────────────────────────────
          category:                    string
          subcategory:                 string | null
          categories:                  string[]
          publishing_frequency:        string | null
          // ── Platform links ──────────────────────────────────────
          rss_feed_url:                string | null
          website:                     string | null
          apple_url:                   string | null
          spotify_url:                 string | null
          // ── Content stats ────────────────────────────────────────
          episode_count:               number
          last_episode_date:           string | null
          language:                    string
          activity_status:             string
          // ── Contact Intelligence ─────────────────────────────────
          primary_email:               string | null
          producer_name:               string | null
          producer_email:              string | null
          host_email:                  string | null
          booking_email:               string | null
          contact_form_url:            string | null
          booking_link:                string | null
          preferred_contact_method:    string | null
          contact_confidence:          string
          contact_verified_at:         string | null
          outreach_ready:              boolean
          contact_notes:               string | null
          // ── Social ──────────────────────────────────────────────
          instagram_url:               string | null
          linkedin_url:                string | null
          youtube_url:                 string | null
          twitter_url:                 string | null
          // ── Guest Intelligence ───────────────────────────────────
          accepts_guests:              boolean
          guest_requirements:          string | null
          typical_guest_type:          string | null
          guest_application_required:  boolean
          guest_expertise_areas:       string[]
          guest_experience_level:      string | null
          remote_interviews:           boolean
          video_interviews:            boolean
          audio_only:                  boolean
          interview_length_min:        number | null
          avg_guest_frequency:         string | null
          // ── Audience Intelligence ────────────────────────────────
          target_audience:             string | null
          audience_pain_points:        string[]
          audience_goals:              string[]
          industry_focus:              string[]
          experience_level:            string | null
          geographic_focus:            string | null
          faith_based:                 boolean
          business_focused:            boolean
          personal_development:        boolean
          leadership_focused:          boolean
          entrepreneurship_focused:    boolean
          // ── Matching Intelligence Scores (computed by trigger) ───
          authority_score:             number
          guest_friendliness_score:    number
          visibility_score:            number
          response_probability_score:  number
          audience_alignment_score:    number
          match_quality_score:         number
          // ── GENERATED column (read-only) ────────────────────────
          contact_method_rank:         number
          // ── RSS enrichment cache ─────────────────────────────────
          rss_owner_name:              string | null
          rss_owner_email:             string | null
          rss_parsed_at:               string | null
          // ── Data Quality & Cleanup ───────────────────────────────
          is_duplicate:                boolean
          duplicate_of:                string | null
          website_verified:            boolean
          website_verified_at:         string | null
          publishing_verified:         boolean
          last_verified_at:            string | null
          abandoned_flag:              boolean
          category_standardized:       boolean
          // ── Admin ────────────────────────────────────────────────
          enrichment_status:           string
          quality_score:               number
          curated:                     boolean
          notes:                       string | null
          // ── Timestamps ──────────────────────────────────────────
          created_at:                  string
          updated_at:                  string
        }
        Insert: {
          id?:                         string
          slug:                        string
          podcast_name:                string
          host_name:                   string
          co_host_name?:               string | null
          description?:                string | null
          artwork_url?:                string | null
          category:                    string
          subcategory?:                string | null
          categories?:                 string[]
          publishing_frequency?:       string | null
          rss_feed_url?:               string | null
          website?:                    string | null
          apple_url?:                  string | null
          spotify_url?:                string | null
          episode_count?:              number
          last_episode_date?:          string | null
          language?:                   string
          activity_status?:            string
          primary_email?:              string | null
          producer_name?:              string | null
          producer_email?:             string | null
          host_email?:                 string | null
          booking_email?:              string | null
          contact_form_url?:           string | null
          booking_link?:               string | null
          preferred_contact_method?:   string | null
          contact_confidence?:         string
          contact_verified_at?:        string | null
          outreach_ready?:             boolean
          contact_notes?:              string | null
          instagram_url?:              string | null
          linkedin_url?:               string | null
          youtube_url?:                string | null
          twitter_url?:                string | null
          accepts_guests?:             boolean
          guest_requirements?:         string | null
          typical_guest_type?:         string | null
          guest_application_required?: boolean
          guest_expertise_areas?:      string[]
          guest_experience_level?:     string | null
          remote_interviews?:          boolean
          video_interviews?:           boolean
          audio_only?:                 boolean
          interview_length_min?:       number | null
          avg_guest_frequency?:        string | null
          target_audience?:            string | null
          audience_pain_points?:       string[]
          audience_goals?:             string[]
          industry_focus?:             string[]
          experience_level?:           string | null
          geographic_focus?:           string | null
          faith_based?:                boolean
          business_focused?:           boolean
          personal_development?:       boolean
          leadership_focused?:         boolean
          entrepreneurship_focused?:   boolean
          // Scores are computed by trigger — omit from Insert
          // contact_method_rank is GENERATED — omit from Insert
          rss_owner_name?:             string | null
          rss_owner_email?:            string | null
          rss_parsed_at?:              string | null
          is_duplicate?:               boolean
          duplicate_of?:               string | null
          website_verified?:           boolean
          website_verified_at?:        string | null
          publishing_verified?:        boolean
          last_verified_at?:           string | null
          abandoned_flag?:             boolean
          category_standardized?:      boolean
          enrichment_status?:          string
          quality_score?:              number
          curated?:                    boolean
          notes?:                      string | null
          created_at?:                 string
          updated_at?:                 string
        }
        Update: {
          podcast_name?:               string
          host_name?:                  string
          co_host_name?:               string | null
          description?:                string | null
          artwork_url?:                string | null
          category?:                   string
          subcategory?:                string | null
          categories?:                 string[]
          publishing_frequency?:       string | null
          rss_feed_url?:               string | null
          website?:                    string | null
          apple_url?:                  string | null
          spotify_url?:                string | null
          episode_count?:              number
          last_episode_date?:          string | null
          activity_status?:            string
          primary_email?:              string | null
          producer_name?:              string | null
          producer_email?:             string | null
          host_email?:                 string | null
          booking_email?:              string | null
          contact_form_url?:           string | null
          booking_link?:               string | null
          preferred_contact_method?:   string | null
          contact_confidence?:         string
          contact_verified_at?:        string | null
          outreach_ready?:             boolean
          contact_notes?:              string | null
          instagram_url?:              string | null
          linkedin_url?:               string | null
          youtube_url?:                string | null
          twitter_url?:                string | null
          accepts_guests?:             boolean
          guest_requirements?:         string | null
          typical_guest_type?:         string | null
          guest_application_required?: boolean
          guest_expertise_areas?:      string[]
          guest_experience_level?:     string | null
          remote_interviews?:          boolean
          video_interviews?:           boolean
          audio_only?:                 boolean
          interview_length_min?:       number | null
          avg_guest_frequency?:        string | null
          target_audience?:            string | null
          audience_pain_points?:       string[]
          audience_goals?:             string[]
          industry_focus?:             string[]
          experience_level?:           string | null
          geographic_focus?:           string | null
          faith_based?:                boolean
          business_focused?:           boolean
          personal_development?:       boolean
          leadership_focused?:         boolean
          entrepreneurship_focused?:   boolean
          rss_owner_name?:             string | null
          rss_owner_email?:            string | null
          rss_parsed_at?:              string | null
          is_duplicate?:               boolean
          duplicate_of?:               string | null
          website_verified?:           boolean
          website_verified_at?:        string | null
          publishing_verified?:        boolean
          last_verified_at?:           string | null
          abandoned_flag?:             boolean
          category_standardized?:      boolean
          enrichment_status?:          string
          quality_score?:              number
          curated?:                    boolean
          notes?:                      string | null
          updated_at?:                 string
        }
        Relationships: []
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
  }
}
