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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievement_types: {
        Row: {
          badge_icon: string | null
          created_at: string | null
          criteria: Json | null
          description: string | null
          id: string
          name: string
          points: number | null
        }
        Insert: {
          badge_icon?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name: string
          points?: number | null
        }
        Update: {
          badge_icon?: string | null
          created_at?: string | null
          criteria?: Json | null
          description?: string | null
          id?: string
          name?: string
          points?: number | null
        }
        Relationships: []
      }
      admins: {
        Row: {
          auth_id: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          role_id: string | null
          updated_at: string
        }
        Insert: {
          auth_id?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string
          role_id?: string | null
          updated_at?: string
        }
        Update: {
          auth_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          role_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admins_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      images: {
        Row: {
          created_at: string | null
          file_size: number | null
          id: string
          image_type: string
          mime_type: string | null
          report_id: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_type: string
          mime_type?: string | null
          report_id?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          image_type?: string
          mime_type?: string | null
          report_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_images_report_id"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "user_waste_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_images_report_id"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "waste_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string
          country: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          state: string
        }
        Insert: {
          city: string
          country?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string
        }
        Relationships: []
      }
      report_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          report_id: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          report_id: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          report_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_report_activities_report_id"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "user_waste_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_report_activities_report_id"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "waste_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_report_activities_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      report_statuses: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_type_id: string
          count: number | null
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_type_id: string
          count?: number | null
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_type_id?: string
          count?: number | null
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_achievements_achievement_type_id"
            columns: ["achievement_type_id"]
            isOneToOne: false
            referencedRelation: "achievement_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user_achievements_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_statistics: {
        Row: {
          id: string
          last_month_reset: string | null
          last_week_reset: string | null
          last_year_reset: string | null
          monthly_reports: number | null
          total_points: number | null
          total_reports: number | null
          updated_at: string | null
          user_id: string
          weekly_reports: number | null
          yearly_reports: number | null
        }
        Insert: {
          id?: string
          last_month_reset?: string | null
          last_week_reset?: string | null
          last_year_reset?: string | null
          monthly_reports?: number | null
          total_points?: number | null
          total_reports?: number | null
          updated_at?: string | null
          user_id: string
          weekly_reports?: number | null
          yearly_reports?: number | null
        }
        Update: {
          id?: string
          last_month_reset?: string | null
          last_week_reset?: string | null
          last_year_reset?: string | null
          monthly_reports?: number | null
          total_points?: number | null
          total_reports?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_reports?: number | null
          yearly_reports?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_statistics_user_id"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auth_id: string | null
          citizen_of_month_count: number | null
          citizen_of_week_count: number | null
          citizen_of_year_count: number | null
          created_at: string
          email: string
          id: string
          last_month_reset: string | null
          last_week_reset: string | null
          last_year_reset: string | null
          location: string | null
          location_id: string | null
          monthly_reports: number | null
          name: string
          total_reports: number | null
          updated_at: string
          weekly_reports: number | null
          yearly_reports: number | null
        }
        Insert: {
          auth_id?: string | null
          citizen_of_month_count?: number | null
          citizen_of_week_count?: number | null
          citizen_of_year_count?: number | null
          created_at?: string
          email: string
          id?: string
          last_month_reset?: string | null
          last_week_reset?: string | null
          last_year_reset?: string | null
          location?: string | null
          location_id?: string | null
          monthly_reports?: number | null
          name: string
          total_reports?: number | null
          updated_at?: string
          weekly_reports?: number | null
          yearly_reports?: number | null
        }
        Update: {
          auth_id?: string | null
          citizen_of_month_count?: number | null
          citizen_of_week_count?: number | null
          citizen_of_year_count?: number | null
          created_at?: string
          email?: string
          id?: string
          last_month_reset?: string | null
          last_week_reset?: string | null
          last_year_reset?: string | null
          location?: string | null
          location_id?: string | null
          monthly_reports?: number | null
          name?: string
          total_reports?: number | null
          updated_at?: string
          weekly_reports?: number | null
          yearly_reports?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "users_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      waste_reports: {
        Row: {
          address: string
          after_image_url: string | null
          authority_comments: string | null
          before_image_url: string | null
          category: string
          category_id: string | null
          created_at: string | null
          id: string
          image_url: string
          latitude: number
          location_id: string | null
          longitude: number
          remarks: string | null
          status: string
          status_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address: string
          after_image_url?: string | null
          authority_comments?: string | null
          before_image_url?: string | null
          category: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          latitude: number
          location_id?: string | null
          longitude: number
          remarks?: string | null
          status: string
          status_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string
          after_image_url?: string | null
          authority_comments?: string | null
          before_image_url?: string | null
          category?: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          latitude?: number
          location_id?: string | null
          longitude?: number
          remarks?: string | null
          status?: string
          status_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_reports_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_reports_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_reports_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "report_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_waste_reports: {
        Row: {
          address: string | null
          after_image_url: string | null
          authority_comments: string | null
          before_image_url: string | null
          category: string | null
          category_id: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          latitude: number | null
          location_id: string | null
          longitude: number | null
          remarks: string | null
          status: string | null
          status_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_reports_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_reports_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_reports_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "report_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waste_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_public_waste_reports: {
        Args: Record<PropertyKey, never>
        Returns: {
          address: string
          after_image_url: string
          approximate_location: string
          authority_comments: string
          before_image_url: string
          category: string
          created_at: string
          id: string
          image_url: string
          remarks: string
          status: string
          updated_at: string
        }[]
      }
      reset_monthly_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_weekly_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      reset_yearly_counts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
