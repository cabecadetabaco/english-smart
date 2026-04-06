export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "student" | "admin";
          level: "beginner" | "intermediate" | "advanced";
          streak_days: number;
          last_access: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          level?: "beginner" | "intermediate" | "advanced";
          streak_days?: number;
          last_access?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          level?: "beginner" | "intermediate" | "advanced";
          streak_days?: number;
          last_access?: string | null;
          created_at?: string;
        };
      };
      modules: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          order_index: number;
          total_lessons: number;
          is_active: boolean;
          cover_image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          order_index: number;
          total_lessons?: number;
          is_active?: boolean;
          cover_image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          total_lessons?: number;
          is_active?: boolean;
          cover_image_url?: string | null;
          created_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          order_index: number;
          video_url: string | null;
          canva_embed_url: string | null;
          audio_urls: Json | null;
          exercise_links: Json | null;
          google_form_url: string | null;
          task_description: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          order_index: number;
          video_url?: string | null;
          canva_embed_url?: string | null;
          audio_urls?: Json | null;
          exercise_links?: Json | null;
          google_form_url?: string | null;
          task_description?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          video_url?: string | null;
          canva_embed_url?: string | null;
          audio_urls?: Json | null;
          exercise_links?: Json | null;
          google_form_url?: string | null;
          task_description?: string | null;
          is_published?: boolean;
          created_at?: string;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          video_done: boolean;
          slides_done: boolean;
          listen_repeat_done: boolean;
          exercises_done: boolean;
          live_class_done: boolean;
          task_done: boolean;
          mission_submitted: boolean;
          mission_grade: number | null;
          mission_graded_at: string | null;
          mission_graded_by: string | null;
          completion_percentage: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          video_done?: boolean;
          slides_done?: boolean;
          listen_repeat_done?: boolean;
          exercises_done?: boolean;
          live_class_done?: boolean;
          task_done?: boolean;
          mission_submitted?: boolean;
          mission_grade?: number | null;
          mission_graded_at?: string | null;
          mission_graded_by?: string | null;
          completion_percentage?: number;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          student_id?: string;
          lesson_id?: string;
          video_done?: boolean;
          slides_done?: boolean;
          listen_repeat_done?: boolean;
          exercises_done?: boolean;
          live_class_done?: boolean;
          task_done?: boolean;
          mission_submitted?: boolean;
          mission_grade?: number | null;
          mission_graded_at?: string | null;
          mission_graded_by?: string | null;
          completion_percentage?: number;
          completed_at?: string | null;
        };
      };
      class_schedules: {
        Row: {
          id: string;
          student_id: string;
          scheduled_date: string;
          type: "live" | "makeup";
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          scheduled_date: string;
          type: "live" | "makeup";
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          scheduled_date?: string;
          type?: "live" | "makeup";
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          created_at?: string;
        };
      };
      notices: {
        Row: {
          id: string;
          title: string;
          content: string;
          type: "info" | "warning" | "success" | "grade";
          is_active: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          type?: "info" | "warning" | "success" | "grade";
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          type?: "info" | "warning" | "success" | "grade";
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          student_id: string;
          type: "grade" | "class" | "notice" | "achievement";
          title: string;
          message: string;
          is_read: boolean;
          reference_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          type: "grade" | "class" | "notice" | "achievement";
          title: string;
          message: string;
          is_read?: boolean;
          reference_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          type?: "grade" | "class" | "notice" | "achievement";
          title?: string;
          message?: string;
          is_read?: boolean;
          reference_id?: string | null;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
          points: number;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
          points: number;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          condition_type?: string;
          condition_value?: number;
          points?: number;
        };
      };
      student_achievements: {
        Row: {
          id: string;
          student_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          achievement_id?: string;
          earned_at?: string;
        };
      };
      library_items: {
        Row: {
          id: string;
          title: string;
          type: "pdf" | "link" | "audio" | "video";
          url: string;
          module_id: string | null;
          tags: Json | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: "pdf" | "link" | "audio" | "video";
          url: string;
          module_id?: string | null;
          tags?: Json | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          type?: "pdf" | "link" | "audio" | "video";
          url?: string;
          module_id?: string | null;
          tags?: Json | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      landing_leads: {
        Row: {
          id: string;
          name: string;
          whatsapp: string;
          preferred_time: "morning" | "afternoon" | "evening" | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          whatsapp: string;
          preferred_time?: "morning" | "afternoon" | "evening" | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          whatsapp?: string;
          preferred_time?: "morning" | "afternoon" | "evening" | null;
          source?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
