export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Args: {
          user_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
