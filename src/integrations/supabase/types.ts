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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_generated_scenes: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          mood_tags: string[] | null
          prompt: string
          scene_data: Json
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          mood_tags?: string[] | null
          prompt: string
          scene_data: Json
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          mood_tags?: string[] | null
          prompt?: string
          scene_data?: Json
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          created_at: string
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          setting_key: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          conversation_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          message_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          created_at: string
          details: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean
          max_participants: number | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean
          max_participants?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean
          max_participants?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_context: {
        Row: {
          context_summary: string | null
          conversation_id: string
          created_at: string
          id: string
          key_topics: string[] | null
          updated_at: string
          user_preferences: Json | null
        }
        Insert: {
          context_summary?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          key_topics?: string[] | null
          updated_at?: string
          user_preferences?: Json | null
        }
        Update: {
          context_summary?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          key_topics?: string[] | null
          updated_at?: string
          user_preferences?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_context_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          archived: boolean
          created_at: string
          folder_id: string | null
          id: string
          pinned: boolean
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          folder_id?: string | null
          id?: string
          pinned?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          folder_id?: string | null
          id?: string
          pinned?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_backgrounds: {
        Row: {
          created_at: string
          id: string
          theme_category: string
          thumbnail_url: string | null
          user_id: string
          video_name: string
          video_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          theme_category?: string
          thumbnail_url?: string | null
          user_id: string
          video_name: string
          video_path: string
        }
        Update: {
          created_at?: string
          id?: string
          theme_category?: string
          thumbnail_url?: string | null
          user_id?: string
          video_name?: string
          video_path?: string
        }
        Relationships: []
      }
      email_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
          subscribed: boolean
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
          subscribed?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
          subscribed?: boolean
        }
        Relationships: []
      }
      folders: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          position: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          position?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          position?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          model_used: string | null
          role: string
          search_vector: unknown
          tokens_used: number | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role: string
          search_vector?: unknown
          tokens_used?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          model_used?: string | null
          role?: string
          search_vector?: unknown
          tokens_used?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      page_analytics: {
        Row: {
          browser: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          device_info: Json
          fps_average: number | null
          id: string
          memory_usage: number | null
          recommended_quality: string | null
          timestamp: string
          user_id: string | null
          video_quality: string | null
        }
        Insert: {
          device_info: Json
          fps_average?: number | null
          id?: string
          memory_usage?: number | null
          recommended_quality?: string | null
          timestamp?: string
          user_id?: string | null
          video_quality?: string | null
        }
        Update: {
          device_info?: Json
          fps_average?: number | null
          id?: string
          memory_usage?: number | null
          recommended_quality?: string | null
          timestamp?: string
          user_id?: string | null
          video_quality?: string | null
        }
        Relationships: []
      }
      proactive_suggestions: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          relevance_score: number | null
          shown: boolean | null
          suggestion_text: string
          suggestion_type: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          relevance_score?: number | null
          shown?: boolean | null
          suggestion_text: string
          suggestion_type?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          relevance_score?: number | null
          shown?: boolean | null
          suggestion_text?: string
          suggestion_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "proactive_suggestions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          preferences: Json | null
          pro_trial_until: string | null
          referral_code: string | null
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          preferences?: Json | null
          pro_trial_until?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          preferences?: Json | null
          pro_trial_until?: string | null
          referral_code?: string | null
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string
          reward_granted: boolean | null
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id: string
          reward_granted?: boolean | null
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          reward_granted?: boolean | null
          status?: string | null
        }
        Relationships: []
      }
      room_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          room_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          room_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_participants: {
        Row: {
          id: string
          joined_at: string
          last_read_at: string
          role: string
          room_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_read_at?: string
          role?: string
          room_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_read_at?: string
          role?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      scene_activity_log: {
        Row: {
          chat_context: Json | null
          duration_seconds: number | null
          id: string
          interaction_quality: string | null
          scene_type: string
          timestamp: string
          user_id: string
        }
        Insert: {
          chat_context?: Json | null
          duration_seconds?: number | null
          id?: string
          interaction_quality?: string | null
          scene_type: string
          timestamp?: string
          user_id: string
        }
        Update: {
          chat_context?: Json | null
          duration_seconds?: number | null
          id?: string
          interaction_quality?: string | null
          scene_type?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      scene_playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean
          mood: string
          name: string
          scenes: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          mood: string
          name: string
          scenes?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean
          mood?: string
          name?: string
          scenes?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scene_preferences: {
        Row: {
          active_playlist_id: string | null
          auto_theme_enabled: boolean | null
          created_at: string
          favorite_scenes: Json | null
          geolocation_enabled: boolean | null
          id: string
          location_data: Json | null
          parallax_intensity: number | null
          time_based_themes: Json | null
          transition_duration: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_playlist_id?: string | null
          auto_theme_enabled?: boolean | null
          created_at?: string
          favorite_scenes?: Json | null
          geolocation_enabled?: boolean | null
          id?: string
          location_data?: Json | null
          parallax_intensity?: number | null
          time_based_themes?: Json | null
          transition_duration?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_playlist_id?: string | null
          auto_theme_enabled?: boolean | null
          created_at?: string
          favorite_scenes?: Json | null
          geolocation_enabled?: boolean | null
          id?: string
          location_data?: Json | null
          parallax_intensity?: number | null
          time_based_themes?: Json | null
          transition_duration?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scene_preferences_active_playlist_id_fkey"
            columns: ["active_playlist_id"]
            isOneToOne: false
            referencedRelation: "scene_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      search_results: {
        Row: {
          created_at: string
          id: string
          message_id: string | null
          query: string
          results: Json | null
          sources: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          message_id?: string | null
          query: string
          results?: Json | null
          sources?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string | null
          query?: string
          results?: Json | null
          sources?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "search_results_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_conversations: {
        Row: {
          conversation_id: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_public: boolean
          last_accessed_at: string | null
          password_hash: string | null
          share_token: string
          view_count: number
        }
        Insert: {
          conversation_id: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_public?: boolean
          last_accessed_at?: string | null
          password_hash?: string | null
          share_token?: string
          view_count?: number
        }
        Update: {
          conversation_id?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_public?: boolean
          last_accessed_at?: string | null
          password_hash?: string | null
          share_token?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "shared_conversations_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_stats: {
        Row: {
          cost_usd: number | null
          created_at: string
          date: string
          id: string
          messages_sent: number
          model_used: string | null
          tokens_used: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          date?: string
          id?: string
          messages_sent?: number
          model_used?: string | null
          tokens_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          date?: string
          id?: string
          messages_sent?: number
          model_used?: string | null
          tokens_used?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          content: string
          created_at: string
          id: string
          importance_score: number | null
          last_accessed: string | null
          memory_type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          importance_score?: number | null
          last_accessed?: string | null
          memory_type?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          importance_score?: number | null
          last_accessed?: string | null
          memory_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      promote_admin_by_email: { Args: { user_email: string }; Returns: Json }
      search_messages: {
        Args: { search_query: string }
        Returns: {
          content: string
          conversation_id: string
          conversation_title: string
          created_at: string
          id: string
          rank: number
          role: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
