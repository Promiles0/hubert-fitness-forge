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
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in_time: string
          check_out_time: string | null
          class_schedule_id: string | null
          created_at: string
          id: string
          member_id: string | null
          updated_at: string
        }
        Insert: {
          check_in_time?: string
          check_out_time?: string | null
          class_schedule_id?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          updated_at?: string
        }
        Update: {
          check_in_time?: string
          check_out_time?: string | null
          class_schedule_id?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_schedule_id_fkey"
            columns: ["class_schedule_id"]
            isOneToOne: false
            referencedRelation: "class_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          class_schedule_id: string | null
          created_at: string
          id: string
          member_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          class_schedule_id?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          class_schedule_id?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_class_schedule_id_fkey"
            columns: ["class_schedule_id"]
            isOneToOne: false
            referencedRelation: "class_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          class_id: string | null
          created_at: string
          day_of_week: number | null
          end_time: string
          id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          day_of_week?: number | null
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          day_of_week?: number | null
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number
          class_type: Database["public"]["Enums"]["class_type"]
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          name: string
          recurring: boolean
          room: string | null
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          capacity: number
          class_type: Database["public"]["Enums"]["class_type"]
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          name: string
          recurring?: boolean
          room?: string | null
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number
          class_type?: Database["public"]["Enums"]["class_type"]
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          recurring?: boolean
          room?: string | null
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number
          created_at: string
          date: string
          id: string
          items: string[]
          meal_type: string
          name: string
          time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          calories?: number
          created_at?: string
          date?: string
          id?: string
          items?: string[]
          meal_type: string
          name: string
          time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          created_at?: string
          date?: string
          id?: string
          items?: string[]
          meal_type?: string
          name?: string
          time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      member_notes: {
        Row: {
          admin_id: string | null
          created_at: string
          id: string
          member_id: string | null
          note: string
          updated_at: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          note: string
          updated_at?: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          id?: string
          member_id?: string | null
          note?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_notes_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          address: string | null
          assigned_trainer_id: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          expiry_date: string | null
          first_name: string
          fitness_goals: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_blocked: boolean | null
          join_date: string
          last_activity: string | null
          last_name: string
          medical_notes: string | null
          membership_plan_id: string | null
          phone: string | null
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          assigned_trainer_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          expiry_date?: string | null
          first_name: string
          fitness_goals?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_blocked?: boolean | null
          join_date?: string
          last_activity?: string | null
          last_name: string
          medical_notes?: string | null
          membership_plan_id?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          assigned_trainer_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          expiry_date?: string | null
          first_name?: string
          fitness_goals?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_blocked?: boolean | null
          join_date?: string
          last_activity?: string | null
          last_name?: string
          medical_notes?: string | null
          membership_plan_id?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          name: string
          plan_type: Database["public"]["Enums"]["membership_plan_type"]
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          name: string
          plan_type: Database["public"]["Enums"]["membership_plan_type"]
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          name?: string
          plan_type?: Database["public"]["Enums"]["membership_plan_type"]
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          message_type: Database["public"]["Enums"]["message_type"]
          recipient_id: string | null
          sender_id: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type: Database["public"]["Enums"]["message_type"]
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: Database["public"]["Enums"]["message_type"]
          recipient_id?: string | null
          sender_id?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          price_per_unit: number
          product_id: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_per_unit: number
          product_id?: string | null
          quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          price_per_unit?: number
          product_id?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          member_id: string | null
          payment_id: string | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id?: string | null
          payment_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string | null
          payment_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          member_id: string | null
          membership_plan_id: string | null
          payment_date: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          member_id?: string | null
          membership_plan_id?: string | null
          payment_date?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          member_id?: string | null
          membership_plan_id?: string | null
          payment_date?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          price: number
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          price: number
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          price?: number
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact: string | null
          first_name: string | null
          fitness_goals: string | null
          gender: string | null
          id: string
          last_name: string | null
          medical_notes: string | null
          name: string | null
          phone: string | null
          preferences: Json | null
          profile_picture: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          fitness_goals?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          medical_notes?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          profile_picture?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: string | null
          avatar?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact?: string | null
          first_name?: string | null
          fitness_goals?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          medical_notes?: string | null
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          profile_picture?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      trainers: {
        Row: {
          availability: Json | null
          bio: string | null
          certifications: Json | null
          created_at: string
          email: string
          experience_years: number | null
          first_name: string
          hourly_rate: number | null
          id: string
          is_active: boolean
          last_name: string
          phone: string | null
          photo_url: string | null
          social_links: Json | null
          specialties: Database["public"]["Enums"]["trainer_specialty"][]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string
          email: string
          experience_years?: number | null
          first_name: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          last_name: string
          phone?: string | null
          photo_url?: string | null
          social_links?: Json | null
          specialties: Database["public"]["Enums"]["trainer_specialty"][]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          certifications?: Json | null
          created_at?: string
          email?: string
          experience_years?: number | null
          first_name?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          last_name?: string
          phone?: string | null
          photo_url?: string | null
          social_links?: Json | null
          specialties?: Database["public"]["Enums"]["trainer_specialty"][]
          updated_at?: string
          user_id?: string | null
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
          role: Database["public"]["Enums"]["app_role"]
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
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member" | "trainer" | "staff"
      booking_status:
        | "confirmed"
        | "cancelled"
        | "waitlisted"
        | "attended"
        | "no_show"
      class_type: "group" | "personal" | "specialty" | "workshop"
      class_type_enum:
        | "yoga"
        | "hiit"
        | "cardio"
        | "strength"
        | "pilates"
        | "crossfit"
        | "zumba"
        | "spinning"
        | "boxing"
        | "functional"
      gender_type: "male" | "female" | "other" | "prefer_not_to_say"
      member_status: "active" | "suspended" | "expired" | "pending"
      membership_plan_type: "monthly" | "quarterly" | "yearly" | "trial" | "vip"
      membership_plan_type_enum:
        | "basic"
        | "premium"
        | "pro"
        | "vip"
        | "student"
        | "family"
      message_type: "admin" | "customer" | "system"
      payment_method:
        | "card"
        | "paypal"
        | "cash"
        | "mobile_money"
        | "bank_transfer"
      payment_status: "successful" | "pending" | "failed" | "refunded"
      trainer_specialty:
        | "strength"
        | "cardio"
        | "hiit"
        | "yoga"
        | "pilates"
        | "crossfit"
        | "nutrition"
        | "rehabilitation"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "member", "trainer", "staff"],
      booking_status: [
        "confirmed",
        "cancelled",
        "waitlisted",
        "attended",
        "no_show",
      ],
      class_type: ["group", "personal", "specialty", "workshop"],
      class_type_enum: [
        "yoga",
        "hiit",
        "cardio",
        "strength",
        "pilates",
        "crossfit",
        "zumba",
        "spinning",
        "boxing",
        "functional",
      ],
      gender_type: ["male", "female", "other", "prefer_not_to_say"],
      member_status: ["active", "suspended", "expired", "pending"],
      membership_plan_type: ["monthly", "quarterly", "yearly", "trial", "vip"],
      membership_plan_type_enum: [
        "basic",
        "premium",
        "pro",
        "vip",
        "student",
        "family",
      ],
      message_type: ["admin", "customer", "system"],
      payment_method: [
        "card",
        "paypal",
        "cash",
        "mobile_money",
        "bank_transfer",
      ],
      payment_status: ["successful", "pending", "failed", "refunded"],
      trainer_specialty: [
        "strength",
        "cardio",
        "hiit",
        "yoga",
        "pilates",
        "crossfit",
        "nutrition",
        "rehabilitation",
      ],
    },
  },
} as const
