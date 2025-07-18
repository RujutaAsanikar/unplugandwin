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
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      parent_surveys: {
        Row: {
          behavior_changes: string | null
          benefit_types: string[] | null
          challenge_types: string[] | null
          child_name: string | null
          concern_level: string | null
          created_at: string | null
          id: string
          knows_apps_used: string | null
          monitoring_likelihood: string | null
          monthly_budget: string | null
          name: string | null
          noticed_changes: string | null
          other_budget: string | null
          reward_types: string[] | null
          support_challenge: string | null
          usage_rating: string | null
        }
        Insert: {
          behavior_changes?: string | null
          benefit_types?: string[] | null
          challenge_types?: string[] | null
          child_name?: string | null
          concern_level?: string | null
          created_at?: string | null
          id?: string
          knows_apps_used?: string | null
          monitoring_likelihood?: string | null
          monthly_budget?: string | null
          name?: string | null
          noticed_changes?: string | null
          other_budget?: string | null
          reward_types?: string[] | null
          support_challenge?: string | null
          usage_rating?: string | null
        }
        Update: {
          behavior_changes?: string | null
          benefit_types?: string[] | null
          challenge_types?: string[] | null
          child_name?: string | null
          concern_level?: string | null
          created_at?: string | null
          id?: string
          knows_apps_used?: string | null
          monitoring_likelihood?: string | null
          monthly_budget?: string | null
          name?: string | null
          noticed_changes?: string | null
          other_budget?: string | null
          reward_types?: string[] | null
          support_challenge?: string | null
          usage_rating?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      screen_time_entries: {
        Row: {
          created_at: string | null
          date: string
          hours: number
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          hours: number
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          hours?: number
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      screenshots: {
        Row: {
          created_at: string | null
          id: string
          screen_time_entry_id: string | null
          storage_path: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          screen_time_entry_id?: string | null
          storage_path: string
        }
        Update: {
          created_at?: string | null
          id?: string
          screen_time_entry_id?: string | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "screenshots_screen_time_entry_id_fkey"
            columns: ["screen_time_entry_id"]
            isOneToOne: false
            referencedRelation: "screen_time_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      user_surveys: {
        Row: {
          age: string | null
          areas_of_concern: string[] | null
          child_age: string | null
          created_at: string | null
          daily_screen_time: string | null
          device_access: string | null
          id: string
          name: string | null
          parent_phone: string | null
          personal_phone: string | null
          preferred_rewards: string[] | null
          relationship_to_child: string | null
          screen_time_concern: boolean | null
          social_media_platforms: string[] | null
          user_id: string | null
        }
        Insert: {
          age?: string | null
          areas_of_concern?: string[] | null
          child_age?: string | null
          created_at?: string | null
          daily_screen_time?: string | null
          device_access?: string | null
          id?: string
          name?: string | null
          parent_phone?: string | null
          personal_phone?: string | null
          preferred_rewards?: string[] | null
          relationship_to_child?: string | null
          screen_time_concern?: boolean | null
          social_media_platforms?: string[] | null
          user_id?: string | null
        }
        Update: {
          age?: string | null
          areas_of_concern?: string[] | null
          child_age?: string | null
          created_at?: string | null
          daily_screen_time?: string | null
          device_access?: string | null
          id?: string
          name?: string | null
          parent_phone?: string | null
          personal_phone?: string | null
          preferred_rewards?: string[] | null
          relationship_to_child?: string | null
          screen_time_concern?: boolean | null
          social_media_platforms?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
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
