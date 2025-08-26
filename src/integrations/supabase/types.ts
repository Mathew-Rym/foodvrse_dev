export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievement_milestones: {
        Row: {
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          milestone_type: string
          milestone_value: number
          name: string
          reward_badge_id: string | null
          reward_points: number | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          milestone_type: string
          milestone_value: number
          name: string
          reward_badge_id?: string | null
          reward_points?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          milestone_type?: string
          milestone_value?: number
          name?: string
          reward_badge_id?: string | null
          reward_points?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "achievement_milestones_reward_badge_id_fkey"
            columns: ["reward_badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          category: string
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          rarity: string | null
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          rarity?: string | null
          requirement_type?: string
          requirement_value?: number
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          rarity?: string | null
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      business_notifications: {
        Row: {
          action_url: string | null
          business_id: string | null
          created_at: string | null
          id: string
          message: string
          priority: string | null
          read: boolean | null
          title: string
          type: string
        }
        Insert: {
          action_url?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          priority?: string | null
          read?: boolean | null
          title: string
          type: string
        }
        Update: {
          action_url?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          priority?: string | null
          read?: boolean | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_notifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_notifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_notifications_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_operating_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          business_id: string | null
          close_time: string | null
          created_at: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string | null
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          business_id?: string | null
          close_time?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          business_id?: string | null
          close_time?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_operating_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_operating_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_operating_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_partners: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          business_name: string
          created_at: string | null
          domain: string | null
          email: string
          id: string
          is_approved: boolean | null
          registered_at: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          business_name: string
          created_at?: string | null
          domain?: string | null
          email: string
          id?: string
          is_approved?: boolean | null
          registered_at?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          business_name?: string
          created_at?: string | null
          domain?: string | null
          email?: string
          id?: string
          is_approved?: boolean | null
          registered_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          address: string
          admin_notes: string | null
          analytics_enabled: boolean | null
          auto_accept_orders: boolean | null
          average_rating: number | null
          business_description: string | null
          business_hours: Json | null
          business_license: string | null
          business_logo_url: string | null
          business_name: string
          business_thumbnail_url: string | null
          carbon_credits_earned: number | null
          category: Database["public"]["Enums"]["business_category"] | null
          co2_missed_kg: number | null
          commission_rate: number | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          delivery_radius: number | null
          description: string | null
          dietary_options: string[] | null
          email: string | null
          featured_until: string | null
          id: string
          is_featured: boolean | null
          last_activity: string | null
          last_month_revenue: number | null
          last_month_sales: number | null
          latitude: number | null
          location: string
          longitude: number | null
          max_daily_orders: number | null
          minimum_order_amount: number | null
          notes: string | null
          onboarding_completed: boolean | null
          operating_hours: Json | null
          payment_methods: string[] | null
          phone: string | null
          preparation_time_minutes: number | null
          rating_count: number | null
          social_media: Json | null
          special_offers: string | null
          status: Database["public"]["Enums"]["business_status"] | null
          sustainability_practices: string[] | null
          tax_id: string | null
          total_co2_saved_kg: number | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
          verification_date: string | null
          verification_document_url: string | null
          verification_documents: Json | null
          verification_level:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified_at: string | null
          website_url: string | null
        }
        Insert: {
          address: string
          admin_notes?: string | null
          analytics_enabled?: boolean | null
          auto_accept_orders?: boolean | null
          average_rating?: number | null
          business_description?: string | null
          business_hours?: Json | null
          business_license?: string | null
          business_logo_url?: string | null
          business_name: string
          business_thumbnail_url?: string | null
          carbon_credits_earned?: number | null
          category?: Database["public"]["Enums"]["business_category"] | null
          co2_missed_kg?: number | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_radius?: number | null
          description?: string | null
          dietary_options?: string[] | null
          email?: string | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean | null
          last_activity?: string | null
          last_month_revenue?: number | null
          last_month_sales?: number | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_daily_orders?: number | null
          minimum_order_amount?: number | null
          notes?: string | null
          onboarding_completed?: boolean | null
          operating_hours?: Json | null
          payment_methods?: string[] | null
          phone?: string | null
          preparation_time_minutes?: number | null
          rating_count?: number | null
          social_media?: Json | null
          special_offers?: string | null
          status?: Database["public"]["Enums"]["business_status"] | null
          sustainability_practices?: string[] | null
          tax_id?: string | null
          total_co2_saved_kg?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_date?: string | null
          verification_document_url?: string | null
          verification_documents?: Json | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified_at?: string | null
          website_url?: string | null
        }
        Update: {
          address?: string
          admin_notes?: string | null
          analytics_enabled?: boolean | null
          auto_accept_orders?: boolean | null
          average_rating?: number | null
          business_description?: string | null
          business_hours?: Json | null
          business_license?: string | null
          business_logo_url?: string | null
          business_name?: string
          business_thumbnail_url?: string | null
          carbon_credits_earned?: number | null
          category?: Database["public"]["Enums"]["business_category"] | null
          co2_missed_kg?: number | null
          commission_rate?: number | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          delivery_radius?: number | null
          description?: string | null
          dietary_options?: string[] | null
          email?: string | null
          featured_until?: string | null
          id?: string
          is_featured?: boolean | null
          last_activity?: string | null
          last_month_revenue?: number | null
          last_month_sales?: number | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_daily_orders?: number | null
          minimum_order_amount?: number | null
          notes?: string | null
          onboarding_completed?: boolean | null
          operating_hours?: Json | null
          payment_methods?: string[] | null
          phone?: string | null
          preparation_time_minutes?: number | null
          rating_count?: number | null
          social_media?: Json | null
          special_offers?: string | null
          status?: Database["public"]["Enums"]["business_status"] | null
          sustainability_practices?: string[] | null
          tax_id?: string | null
          total_co2_saved_kg?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          verification_date?: string | null
          verification_document_url?: string | null
          verification_documents?: Json | null
          verification_level?:
            | Database["public"]["Enums"]["verification_level"]
            | null
          verified_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_settings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_verification: {
        Row: {
          business_id: string | null
          created_at: string | null
          document_type: string | null
          document_url: string | null
          id: string
          notes: string | null
          status: string | null
          submitted_at: string | null
          verification_type: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          verification_type: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          document_type?: string | null
          document_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          verification_type?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_verification_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_verification_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "business_verification_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      carbon_credit_waitlist: {
        Row: {
          business_id: string
          business_name: string
          business_type: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string | null
          estimated_monthly_co2_kg: number | null
          id: string
          interested_features: string[] | null
        }
        Insert: {
          business_id: string
          business_name: string
          business_type?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string | null
          estimated_monthly_co2_kg?: number | null
          id?: string
          interested_features?: string[] | null
        }
        Update: {
          business_id?: string
          business_name?: string
          business_type?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string | null
          estimated_monthly_co2_kg?: number | null
          id?: string
          interested_features?: string[] | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_time_based: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_time_based?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_time_based?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      challenge_settings: {
        Row: {
          badge_name: string
          challenge_type: string
          created_at: string
          goal_value: number
          id: string
          updated_at: string
          week_start_day: number
        }
        Insert: {
          badge_name: string
          challenge_type: string
          created_at?: string
          goal_value: number
          id?: string
          updated_at?: string
          week_start_day?: number
        }
        Update: {
          badge_name?: string
          challenge_type?: string
          created_at?: string
          goal_value?: number
          id?: string
          updated_at?: string
          week_start_day?: number
        }
        Relationships: []
      }
      community_challenges: {
        Row: {
          challenge_type: string
          created_at: string | null
          current_value: number | null
          description: string
          end_date: string
          goal_value: number
          id: string
          is_active: boolean | null
          name: string
          reward_badge_id: string | null
          start_date: string
          updated_at: string | null
        }
        Insert: {
          challenge_type: string
          created_at?: string | null
          current_value?: number | null
          description: string
          end_date: string
          goal_value: number
          id?: string
          is_active?: boolean | null
          name: string
          reward_badge_id?: string | null
          start_date: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string
          created_at?: string | null
          current_value?: number | null
          description?: string
          end_date?: string
          goal_value?: number
          id?: string
          is_active?: boolean | null
          name?: string
          reward_badge_id?: string | null
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_challenges_reward_badge_id_fkey"
            columns: ["reward_badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          co2_saved: number | null
          created_at: string | null
          id: string
          meals_saved: number | null
          money_saved: number | null
          period_end: string | null
          period_start: string
          period_type: string
          rank: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          co2_saved?: number | null
          created_at?: string | null
          id?: string
          meals_saved?: number | null
          money_saved?: number | null
          period_end?: string | null
          period_start: string
          period_type: string
          rank?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          co2_saved?: number | null
          created_at?: string | null
          id?: string
          meals_saved?: number | null
          money_saved?: number | null
          period_end?: string | null
          period_start?: string
          period_type?: string
          rank?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      listing_performance: {
        Row: {
          business_id: string
          co2_saved_kg: number | null
          created_at: string | null
          date: string | null
          favorites: number | null
          id: string
          listing_id: string
          purchases: number | null
          revenue: number | null
          updated_at: string | null
          views: number | null
        }
        Insert: {
          business_id: string
          co2_saved_kg?: number | null
          created_at?: string | null
          date?: string | null
          favorites?: number | null
          id?: string
          listing_id: string
          purchases?: number | null
          revenue?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          business_id?: string
          co2_saved_kg?: number | null
          created_at?: string | null
          date?: string | null
          favorites?: number | null
          id?: string
          listing_id?: string
          purchases?: number | null
          revenue?: number | null
          updated_at?: string | null
          views?: number | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          business_id: string
          business_thumbnail_url: string | null
          category: string
          co2_saved_per_item_kg: number | null
          created_at: string | null
          description: string | null
          favorited_by_user_ids: string[] | null
          id: string
          initial_quantity: number
          item_name: string
          latitude: number | null
          longitude: number | null
          original_price: number
          pickup_end: string
          pickup_start: string
          price: number
          quantity: number
          status: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          business_thumbnail_url?: string | null
          category?: string
          co2_saved_per_item_kg?: number | null
          created_at?: string | null
          description?: string | null
          favorited_by_user_ids?: string[] | null
          id?: string
          initial_quantity?: number
          item_name: string
          latitude?: number | null
          longitude?: number | null
          original_price: number
          pickup_end: string
          pickup_start: string
          price: number
          quantity?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          business_thumbnail_url?: string | null
          category?: string
          co2_saved_per_item_kg?: number | null
          created_at?: string | null
          description?: string | null
          favorited_by_user_ids?: string[] | null
          id?: string
          initial_quantity?: number
          item_name?: string
          latitude?: number | null
          longitude?: number | null
          original_price?: number
          pickup_end?: string
          pickup_start?: string
          price?: number
          quantity?: number
          status?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "listings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "listings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_bag_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          mystery_bag_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          mystery_bag_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          mystery_bag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mystery_bag_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mystery_bag_categories_mystery_bag_id_fkey"
            columns: ["mystery_bag_id"]
            isOneToOne: false
            referencedRelation: "mystery_bags"
            referencedColumns: ["id"]
          },
        ]
      }
      mystery_bags: {
        Row: {
          allergen_info: string | null
          business_id: string
          category_name: string | null
          created_at: string
          description: string | null
          id: string
          ingredients: string | null
          is_active: boolean | null
          items_available: number
          original_price: number
          pickup_date: string
          pickup_end_time: string
          pickup_start_time: string
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          allergen_info?: string | null
          business_id: string
          category_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          ingredients?: string | null
          is_active?: boolean | null
          items_available?: number
          original_price: number
          pickup_date?: string
          pickup_end_time: string
          pickup_start_time: string
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          allergen_info?: string | null
          business_id?: string
          category_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          ingredients?: string | null
          is_active?: boolean | null
          items_available?: number
          original_price?: number
          pickup_date?: string
          pickup_end_time?: string
          pickup_start_time?: string
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mystery_bags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "mystery_bags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "mystery_bags_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          business_id: string
          collected_at: string | null
          created_at: string
          id: string
          mystery_bag_id: string
          notes: string | null
          original_total: number
          payment_id: string | null
          payment_method: string | null
          pickup_code: string | null
          quantity: number
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          collected_at?: string | null
          created_at?: string
          id?: string
          mystery_bag_id: string
          notes?: string | null
          original_total: number
          payment_id?: string | null
          payment_method?: string | null
          pickup_code?: string | null
          quantity?: number
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          collected_at?: string | null
          created_at?: string
          id?: string
          mystery_bag_id?: string
          notes?: string | null
          original_total?: number
          payment_id?: string | null
          payment_method?: string | null
          pickup_code?: string | null
          quantity?: number
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "orders_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_mystery_bag_id_fkey"
            columns: ["mystery_bag_id"]
            isOneToOne: false
            referencedRelation: "mystery_bags"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          last_four: string | null
          provider: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          provider?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          provider?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_impact_metrics: {
        Row: {
          created_at: string
          id: string
          total_co2_saved_tonnes: number
          total_energy_saved_kwh: number
          total_meals_rescued: number
          total_money_saved_ksh: number
          total_water_conserved_liters: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_co2_saved_tonnes?: number
          total_energy_saved_kwh?: number
          total_meals_rescued?: number
          total_money_saved_ksh?: number
          total_water_conserved_liters?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          total_co2_saved_tonnes?: number
          total_energy_saved_kwh?: number
          total_meals_rescued?: number
          total_money_saved_ksh?: number
          total_water_conserved_liters?: number
          updated_at?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          business_id: string
          created_at: string
          id: string
          mystery_bag_id: string | null
          order_id: string | null
          rating: number
          review_comment: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          mystery_bag_id?: string | null
          order_id?: string | null
          rating: number
          review_comment?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          mystery_bag_id?: string | null
          order_id?: string | null
          rating?: number
          review_comment?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_analytics"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "ratings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_dashboard_data"
            referencedColumns: ["business_id"]
          },
          {
            foreignKeyName: "ratings_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_mystery_bag_id_fkey"
            columns: ["mystery_bag_id"]
            isOneToOne: false
            referencedRelation: "mystery_bags"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_log: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          points_earned: number | null
          user_id: string | null
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string | null
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          earned_at: string
          id: string
          user_id: string
          week_earned: string | null
        }
        Insert: {
          badge_id: string
          earned_at?: string
          id?: string
          user_id: string
          week_earned?: string | null
        }
        Update: {
          badge_id?: string
          earned_at?: string
          id?: string
          user_id?: string
          week_earned?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          badge_awarded: boolean
          challenge_type: string
          completed: boolean
          completed_at: string | null
          created_at: string
          current_count: number
          id: string
          updated_at: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Insert: {
          badge_awarded?: boolean
          challenge_type: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_count?: number
          id?: string
          updated_at?: string
          user_id: string
          week_end_date: string
          week_start_date: string
        }
        Update: {
          badge_awarded?: boolean
          challenge_type?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          current_count?: number
          id?: string
          updated_at?: string
          user_id?: string
          week_end_date?: string
          week_start_date?: string
        }
        Relationships: []
      }
      user_community_challenges: {
        Row: {
          community_challenge_id: string | null
          completed_at: string | null
          contribution_value: number | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          community_challenge_id?: string | null
          completed_at?: string | null
          contribution_value?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          community_challenge_id?: string | null
          completed_at?: string | null
          contribution_value?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_community_challenges_community_challenge_id_fkey"
            columns: ["community_challenge_id"]
            isOneToOne: false
            referencedRelation: "community_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_impact: {
        Row: {
          badges_earned: string[] | null
          created_at: string
          current_streak: number | null
          experience_points: number | null
          id: string
          level: number | null
          longest_streak: number | null
          total_co2_saved_kg: number | null
          total_meals_saved: number | null
          total_money_saved_ksh: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          badges_earned?: string[] | null
          created_at?: string
          current_streak?: number | null
          experience_points?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_co2_saved_kg?: number | null
          total_meals_saved?: number | null
          total_money_saved_ksh?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          badges_earned?: string[] | null
          created_at?: string
          current_streak?: number | null
          experience_points?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_co2_saved_kg?: number | null
          total_meals_saved?: number | null
          total_money_saved_ksh?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_milestones: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          id: string
          is_completed: boolean | null
          milestone_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          milestone_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          id?: string
          is_completed?: boolean | null
          milestone_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "achievement_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          analytics_consent: boolean | null
          cookie_consent: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language_preference: string | null
          last_activity: string | null
          marketing_consent: boolean | null
          push_notifications: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          analytics_consent?: boolean | null
          cookie_consent?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language_preference?: string | null
          last_activity?: string | null
          marketing_consent?: boolean | null
          push_notifications?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          analytics_consent?: boolean | null
          cookie_consent?: boolean | null
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language_preference?: string | null
          last_activity?: string | null
          marketing_consent?: boolean | null
          push_notifications?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email_notifications: boolean | null
          id: string
          latitude: number | null
          location_name: string | null
          longitude: number | null
          notifications_enabled: boolean | null
          phone: string | null
          push_notifications: boolean | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          phone?: string | null
          push_notifications?: boolean | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          latitude?: number | null
          location_name?: string | null
          longitude?: number | null
          notifications_enabled?: boolean | null
          phone?: string | null
          push_notifications?: boolean | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string | null
          current_streak: number | null
          experience_points: number | null
          experience_to_next_level: number | null
          id: string
          level: number | null
          longest_streak: number | null
          total_co2_saved: number | null
          total_meals_saved: number | null
          total_money_saved: number | null
          total_water_saved: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          experience_points?: number | null
          experience_to_next_level?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_co2_saved?: number | null
          total_meals_saved?: number | null
          total_money_saved?: number | null
          total_water_saved?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          experience_points?: number | null
          experience_to_next_level?: number | null
          id?: string
          level?: number | null
          longest_streak?: number | null
          total_co2_saved?: number | null
          total_meals_saved?: number | null
          total_money_saved?: number | null
          total_water_saved?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      weekly_challenges: {
        Row: {
          badge_awarded_id: string | null
          challenge_type: string
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          goal_value: number
          id: string
          is_completed: boolean | null
          updated_at: string | null
          user_id: string | null
          week_start_date: string
        }
        Insert: {
          badge_awarded_id?: string | null
          challenge_type: string
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_value: number
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          week_start_date: string
        }
        Update: {
          badge_awarded_id?: string | null
          challenge_type?: string
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          goal_value?: number
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_challenges_badge_awarded_id_fkey"
            columns: ["badge_awarded_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      business_analytics: {
        Row: {
          active_listings: number | null
          average_rating: number | null
          business_id: string | null
          business_name: string | null
          category: Database["public"]["Enums"]["business_category"] | null
          created_at: string | null
          rating_count: number | null
          status: Database["public"]["Enums"]["business_status"] | null
          total_co2_saved_kg: number | null
          total_listings: number | null
          total_revenue: number | null
          total_sales: number | null
        }
        Relationships: []
      }
      business_dashboard_data: {
        Row: {
          active_listings: number | null
          average_rating: number | null
          avg_rating: number | null
          business_id: string | null
          business_name: string | null
          category: Database["public"]["Enums"]["business_category"] | null
          created_at: string | null
          rating_count: number | null
          status: Database["public"]["Enums"]["business_status"] | null
          total_co2_saved_kg: number | null
          total_listings: number | null
          total_revenue: number | null
          total_reviews: number | null
          total_sales: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_badge_to_user: {
        Args: { badge_uuid: string; user_uuid: string }
        Returns: boolean
      }
      calculate_distance: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      calculate_user_level: {
        Args: { exp_points: number }
        Returns: {
          exp_to_next: number
          level: number
        }[]
      }
      check_and_award_weekly_badge: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      create_business_notification: {
        Args: {
          p_business_id: string
          p_message: string
          p_priority?: string
          p_title: string
          p_type: string
        }
        Returns: string
      }
      get_all_businesses_with_owners: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          average_rating: number
          business_id: string
          business_name: string
          category: Database["public"]["Enums"]["business_category"]
          created_at: string
          location: string
          owner_email: string
          owner_id: string
          owner_name: string
          status: Database["public"]["Enums"]["business_status"]
          total_revenue: number
          total_sales: number
        }[]
      }
      get_business_owner_details: {
        Args: { business_uuid: string }
        Returns: {
          address: string
          business_id: string
          business_name: string
          category: Database["public"]["Enums"]["business_category"]
          location: string
          owner_email: string
          owner_id: string
          owner_name: string
          status: Database["public"]["Enums"]["business_status"]
        }[]
      }
      get_current_user_type: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_type"]
      }
      get_listings_with_distance: {
        Args: {
          category_filter?: string
          max_distance?: number
          search_query?: string
          user_lat?: number
          user_lon?: number
        }
        Returns: {
          average_rating: number
          business_id: string
          business_lat: number
          business_logo_url: string
          business_lon: number
          business_name: string
          business_thumbnail_url: string
          category: string
          description: string
          distance_km: number
          favorited_by_user_ids: string[]
          id: string
          item_name: string
          location: string
          original_price: number
          pickup_end: string
          pickup_start: string
          price: number
          quantity: number
          rating_count: number
          status: string
          thumbnail_url: string
        }[]
      }
      get_mystery_bags_by_pickup_time: {
        Args: Record<PropertyKey, never>
        Returns: {
          bag_id: string
          pickup_category: string
        }[]
      }
      get_or_create_user_preferences: {
        Args: { user_uuid: string }
        Returns: {
          analytics_consent: boolean | null
          cookie_consent: boolean | null
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language_preference: string | null
          last_activity: string | null
          marketing_consent: boolean | null
          push_notifications: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string
        }
      }
      get_or_create_user_progress: {
        Args: { user_uuid: string }
        Returns: {
          created_at: string | null
          current_streak: number | null
          experience_points: number | null
          experience_to_next_level: number | null
          id: string
          level: number | null
          longest_streak: number | null
          total_co2_saved: number | null
          total_meals_saved: number | null
          total_money_saved: number | null
          total_water_saved: number | null
          updated_at: string | null
          user_id: string | null
        }
      }
      get_user_type: {
        Args: { user_uuid?: string }
        Returns: Database["public"]["Enums"]["user_type"]
      }
      is_business_partner_email: {
        Args: { email_to_check: string }
        Returns: boolean
      }
      process_purchase: {
        Args: { p_listing_id: string; p_quantity?: number; p_user_id: string }
        Returns: Json
      }
      track_listing_favorite: {
        Args: { is_favorited: boolean; listing_uuid: string }
        Returns: undefined
      }
      track_listing_view: {
        Args: { listing_uuid: string }
        Returns: undefined
      }
      update_weekly_challenge_progress: {
        Args: {
          challenge_type_val: string
          increment_value: number
          user_uuid: string
        }
        Returns: boolean
      }
      verify_business: {
        Args: { admin_user_id: string; business_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      business_category:
        | "restaurant"
        | "cafe"
        | "bakery"
        | "grocery_store"
        | "supermarket"
        | "hotel"
        | "catering_service"
        | "food_manufacturer"
        | "food_distributor"
        | "convenience_store"
        | "food_truck"
        | "farmers_market"
        | "other"
      business_status:
        | "pending"
        | "active"
        | "verified"
        | "suspended"
        | "rejected"
        | "inactive"
      user_type: "consumer" | "business"
      verification_level: "unverified" | "basic" | "documented" | "premium"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_category: [
        "restaurant",
        "cafe",
        "bakery",
        "grocery_store",
        "supermarket",
        "hotel",
        "catering_service",
        "food_manufacturer",
        "food_distributor",
        "convenience_store",
        "food_truck",
        "farmers_market",
        "other",
      ],
      business_status: [
        "pending",
        "active",
        "verified",
        "suspended",
        "rejected",
        "inactive",
      ],
      user_type: ["consumer", "business"],
      verification_level: ["unverified", "basic", "documented", "premium"],
    },
  },
} as const
