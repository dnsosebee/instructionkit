export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      client: {
        Row: {
          id: string
          lastmutationid: number
          lastmodified: string
        }
        Insert: {
          id: string
          lastmutationid: number
          lastmodified: string
        }
        Update: {
          id?: string
          lastmutationid?: number
          lastmodified?: string
        }
      }
      entry: {
        Row: {
          spaceid: string
          key: string
          value: string
          deleted: boolean
          version: number
          lastmodified: string
        }
        Insert: {
          spaceid: string
          key: string
          value: string
          deleted: boolean
          version: number
          lastmodified: string
        }
        Update: {
          spaceid?: string
          key?: string
          value?: string
          deleted?: boolean
          version?: number
          lastmodified?: string
        }
      }
      meta: {
        Row: {
          key: string
          value: Json | null
        }
        Insert: {
          key: string
          value?: Json | null
        }
        Update: {
          key?: string
          value?: Json | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          title: string | null
          about: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          title?: string | null
          about?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          title?: string | null
          about?: string | null
        }
      }
      space: {
        Row: {
          id: string
          version: number
          lastmodified: string
        }
        Insert: {
          id: string
          version: number
          lastmodified: string
        }
        Update: {
          id?: string
          version?: number
          lastmodified?: string
        }
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
  }
}
