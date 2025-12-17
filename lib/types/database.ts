export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string
          slot_number: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          description?: string
          slot_number: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string
          slot_number?: number
          created_at?: string
          updated_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string
          category: string
          content: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          title?: string
          category?: string
          content?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          title?: string
          content?: any
          created_at?: string
          updated_at?: string
        }
      }
      features: {
        Row: {
          id: string
          project_id: string
          title: string
          description: string
          category: string
          status: 'planned' | 'in-progress' | 'done'
          order_index: number
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          description?: string
          category?: string
          status?: 'planned' | 'in-progress' | 'done'
          order_index?: number
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          title?: string
          description?: string
          category?: string
          status?: 'planned' | 'in-progress' | 'done'
          order_index?: number
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      releases: {
        Row: {
          id: string
          project_id: string
          version: string
          target_date: string | null
          category: string
          status: 'planned' | 'upcoming' | 'released'
          notes: string
          released_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          version: string
          target_date?: string | null
          category?: string
          status?: 'planned' | 'upcoming' | 'released'
          notes?: string
          released_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          version?: string
          target_date?: string | null
          category?: string
          status?: 'planned' | 'upcoming' | 'released'
          notes?: string
          released_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      release_features: {
        Row: {
          id: string
          release_id: string
          feature_id: string
          created_at: string
        }
        Insert: {
          id?: string
          release_id: string
          feature_id: string
          created_at?: string
        }
        Update: {
          id?: string
          release_id?: string
          feature_id?: string
          created_at?: string
        }
      }

    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type Feature = Database['public']['Tables']['features']['Row']
export type Release = Database['public']['Tables']['releases']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']