export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courts: {
        Row: {
          id: string
          nome_local: string
          photo_url: string | null
          latitude: number | null
          longitude: number | null
          data_hora: string
          nivel: string
          criado_por: string
          created_at: string,
          label: string,
          started_at: string,
          ended_at: string,
          status: string
        }
        Insert: {
          id?: string
          nome_local: string
          photo_url?: string | null
          latitude?: number | null
          longitude?: number | null
          data_hora: string
          nivel: string
          criado_por: string
          created_at?: string
          label?: string
          started_at?: string
          ended_at?: string
          status?: string
        }
        Update: {
          id?: string
          nome_local?: string
          photo_url?: string | null
          latitude?: number | null
          longitude?: number | null
          data_hora?: string
          nivel?: string
          criado_por?: string
          created_at?: string
          label?: string
          started_at?: string
          ended_at?: string
          status?: string
        }
        Relationships: []
      }
      attendances: {
        Row: {
          id: string
          court_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          court_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          nome: string
          created_at: string
        }
        Insert: {
          id: string
          nome: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          created_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          id: string
          full_name: string
          email: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          message?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
