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
      client_risk_metrics: {
        Row: {
          contact_id: string
          created_at: string
          engagement_score: number | null
          id: string
          interaction_frequency: number | null
          last_calculated: string
          last_contact_days: number
          price_sensitivity_score: number | null
          recommendations: Json | null
          risk_factors: Json | null
          risk_score: number
          stage_progression_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          interaction_frequency?: number | null
          last_calculated?: string
          last_contact_days?: number
          price_sensitivity_score?: number | null
          recommendations?: Json | null
          risk_factors?: Json | null
          risk_score?: number
          stage_progression_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          interaction_frequency?: number | null
          last_calculated?: string
          last_contact_days?: number
          price_sensitivity_score?: number | null
          recommendations?: Json | null
          risk_factors?: Json | null
          risk_score?: number
          stage_progression_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_risk_metrics_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          acquisition_source: string | null
          address: string | null
          client_type: string | null
          created_at: string
          district: string | null
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          sales_stage: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          acquisition_source?: string | null
          address?: string | null
          client_type?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          sales_stage?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          acquisition_source?: string | null
          address?: string | null
          client_type?: string | null
          created_at?: string
          district?: string | null
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          sales_stage?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          contact_id: string | null
          created_at: string
          id: string
          interaction_date: string
          interaction_type: string | null
          meeting_location: string | null
          new_stage: string | null
          next_steps: string | null
          notes: string | null
          outcome: string | null
          previous_stage: string | null
          property_id: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          id?: string
          interaction_date?: string
          interaction_type?: string | null
          meeting_location?: string | null
          new_stage?: string | null
          next_steps?: string | null
          notes?: string | null
          outcome?: string | null
          previous_stage?: string | null
          property_id?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          id?: string
          interaction_date?: string
          interaction_type?: string | null
          meeting_location?: string | null
          new_stage?: string | null
          next_steps?: string | null
          notes?: string | null
          outcome?: string | null
          previous_stage?: string | null
          property_id?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      no_purchase_reasons: {
        Row: {
          contact_id: string
          created_at: string
          follow_up_date: string | null
          id: string
          notes: string | null
          price_feedback: number | null
          property_id: string | null
          reason_category: string
          reason_details: string | null
          sales_funnel: string | null
          user_id: string
          will_reconsider: boolean | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          price_feedback?: number | null
          property_id?: string | null
          reason_category: string
          reason_details?: string | null
          sales_funnel?: string | null
          user_id: string
          will_reconsider?: boolean | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          price_feedback?: number | null
          property_id?: string | null
          reason_category?: string
          reason_details?: string | null
          sales_funnel?: string | null
          user_id?: string
          will_reconsider?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_no_purchase_reasons_contact"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_no_purchase_reasons_property"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_metrics: {
        Row: {
          channel: string | null
          created_at: string
          id: string
          metric_date: string
          metric_type: string
          metric_value: number
          team_member_id: string | null
          user_id: string
        }
        Insert: {
          channel?: string | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_type: string
          metric_value: number
          team_member_id?: string | null
          user_id: string
        }
        Update: {
          channel?: string | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_type?: string
          metric_value?: number
          team_member_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          area_m2: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          district: string | null
          id: string
          photo_url: string | null
          price: number | null
          property_type: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          area_m2?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          district?: string | null
          id?: string
          photo_url?: string | null
          price?: number | null
          property_type?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          area_m2?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          district?: string | null
          id?: string
          photo_url?: string | null
          price?: number | null
          property_type?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recovery_actions: {
        Row: {
          action_description: string
          action_type: string
          applied_at: string
          contact_id: string
          created_at: string
          id: string
          notes: string | null
          outcome: string | null
          user_id: string
        }
        Insert: {
          action_description: string
          action_type: string
          applied_at?: string
          contact_id: string
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: string | null
          user_id: string
        }
        Update: {
          action_description?: string
          action_type?: string
          applied_at?: string
          contact_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recovery_actions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          contact_id: string | null
          created_at: string
          description: string | null
          email_sent: boolean | null
          id: string
          priority: string | null
          reminder_date: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string
          description?: string | null
          email_sent?: boolean | null
          id?: string
          priority?: string | null
          reminder_date: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string
          description?: string | null
          email_sent?: boolean | null
          id?: string
          priority?: string | null
          reminder_date?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_alerts: {
        Row: {
          alert_message: string
          alert_type: string
          contact_id: string
          created_at: string
          id: string
          is_read: boolean | null
          is_resolved: boolean | null
          resolved_at: string | null
          risk_score: number
          user_id: string
        }
        Insert: {
          alert_message: string
          alert_type: string
          contact_id: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          resolved_at?: string | null
          risk_score: number
          user_id: string
        }
        Update: {
          alert_message?: string
          alert_type?: string
          contact_id?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          is_resolved?: boolean | null
          resolved_at?: string | null
          risk_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_alerts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_funnel: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          notes: string | null
          stage: string
          stage_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          notes?: string | null
          stage: string
          stage_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          stage?: string
          stage_date?: string
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
      calculate_client_risk_score: {
        Args: { contact_uuid: string; user_uuid: string }
        Returns: {
          engagement_score: number
          interaction_frequency: number
          last_contact_days: number
          recommendations: Json
          risk_factors: Json
          risk_score: number
        }[]
      }
    }
    Enums: {
      user_type: "independent_agent" | "small_company"
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
      user_type: ["independent_agent", "small_company"],
    },
  },
} as const
