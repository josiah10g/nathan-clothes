export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
          subject?: string
        }
        Update: {
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          image_url: string
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          size: string
          unit_price_cents: number
        }
        Insert: {
          id?: string
          image_url?: string
          order_id: string
          product_id?: string | null
          product_name: string
          quantity?: number
          size?: string
          unit_price_cents?: number
        }
        Update: {
          id?: string
          image_url?: string
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          size?: string
          unit_price_cents?: number
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
          id: string
          reference: string
          user_id: string | null
          customer_name: string
          full_name?: string
          phone: string
          email: string
          address: string
          city: string
          postal_code: string
          country: string
          notes: string | null
          items: Json
          total: number
          total_cents: number
          status: string
          payment_status: string
          receipt_path: string | null
          receipt_uploaded_at: string | null
          admin_note: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reference?: string
          user_id?: string | null
          customer_name: string
          full_name?: string
          phone: string
          email: string
          address: string
          city?: string
          postal_code?: string
          country?: string
          notes?: string | null
          items?: Json
          total?: number
          total_cents?: number
          status?: string
          payment_status?: string
          receipt_path?: string | null
          receipt_uploaded_at?: string | null
          admin_note?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reference?: string
          user_id?: string | null
          customer_name?: string
          full_name?: string
          phone?: string
          email?: string
          address?: string
          city?: string
          postal_code?: string
          country?: string
          notes?: string | null
          items?: Json
          total?: number
          total_cents?: number
          status?: string
          payment_status?: string
          receipt_path?: string | null
          receipt_uploaded_at?: string | null
          admin_note?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          brand: string
          category: string
          description: string
          specifications: string
          price: number
          price_cents: number
          image_url: string
          colorway: string
          sizes: string[]
          in_stock: boolean
          stock: number
          featured: boolean
          active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          brand?: string
          category?: string
          description?: string
          specifications?: string
          price?: number
          price_cents?: number
          image_url?: string
          colorway?: string
          sizes?: string[]
          in_stock?: boolean
          stock?: number
          featured?: boolean
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          brand?: string
          category?: string
          description?: string
          specifications?: string
          price?: number
          price_cents?: number
          image_url?: string
          colorway?: string
          sizes?: string[]
          in_stock?: boolean
          stock?: number
          featured?: boolean
          active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          id: string
          bank_name: string
          account_name: string
          account_number: string
          payment_instructions: string
          contact_phone: string
          whatsapp_number: string
          contact_email: string
          updated_at: string
        }
        Insert: {
          id?: string
          bank_name?: string
          account_name?: string
          account_number?: string
          payment_instructions?: string
          contact_phone?: string
          whatsapp_number?: string
          contact_email?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bank_name?: string
          account_name?: string
          account_number?: string
          payment_instructions?: string
          contact_phone?: string
          whatsapp_number?: string
          contact_email?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
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
      admin_exists: { Args: Record<PropertyKey, never>; Returns: boolean }
      claim_first_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      grant_admin_by_email: {
        Args: {
          _email: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      track_order: {
        Args: {
          _reference: string
          _phone: string
        }
        Returns: Json
      }
      attach_receipt: {
        Args: {
          _reference: string
          _phone: string
          _path: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseUser = Database["public"]["Tables"]

export type Tables<T extends keyof DatabaseUser> = DatabaseUser[T]["Row"]
export type TablesInsert<T extends keyof DatabaseUser> = DatabaseUser[T]["Insert"]
export type TablesUpdate<T extends keyof DatabaseUser> = DatabaseUser[T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
