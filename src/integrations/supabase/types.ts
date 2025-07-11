export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      badges: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          address: string
          average_rating: number | null
          business_logo_url: string | null
          business_name: string
          carbon_credits_earned: number | null
          co2_missed_kg: number | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          last_month_revenue: number | null
          last_month_sales: number | null
          latitude: number | null
          location: string
          longitude: number | null
          phone: string | null
          rating_count: number | null
          total_co2_saved_kg: number | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          address: string
          average_rating?: number | null
          business_logo_url?: string | null
          business_name: string
          carbon_credits_earned?: number | null
          co2_missed_kg?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          last_month_revenue?: number | null
          last_month_sales?: number | null
          latitude?: number | null
          location: string
          longitude?: number | null
          phone?: string | null
          rating_count?: number | null
          total_co2_saved_kg?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string
          average_rating?: number | null
          business_logo_url?: string | null
          business_name?: string
          carbon_credits_earned?: number | null
          co2_missed_kg?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          last_month_revenue?: number | null
          last_month_sales?: number | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          phone?: string | null
          rating_count?: number | null
          total_co2_saved_kg?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
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
          category: string
          co2_saved_per_item_kg: number | null
          created_at: string | null
          description: string | null
          favorited_by_user_ids: string[] | null
          id: string
          initial_quantity: number
          item_name: string
          original_price: number
          pickup_end: string
          pickup_start: string
          price: number
          quantity: number
          status: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          business_id: string
          category?: string
          co2_saved_per_item_kg?: number | null
          created_at?: string | null
          description?: string | null
          favorited_by_user_ids?: string[] | null
          id?: string
          initial_quantity?: number
          item_name: string
          original_price: number
          pickup_end: string
          pickup_start: string
          price: number
          quantity?: number
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string
          category?: string
          co2_saved_per_item_kg?: number | null
          created_at?: string | null
          description?: string | null
          favorited_by_user_ids?: string[] | null
          id?: string
          initial_quantity?: number
          item_name?: string
          original_price?: number
          pickup_end?: string
          pickup_start?: string
          price?: number
          quantity?: number
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
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
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_award_weekly_badge: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      get_mystery_bags_by_pickup_time: {
        Args: Record<PropertyKey, never>
        Returns: {
          bag_id: string
          pickup_category: string
        }[]
      }
      process_purchase: {
        Args: { p_listing_id: string; p_user_id: string; p_quantity?: number }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
