export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  chat: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          message_id: number
          sender_profile_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          message_id?: number
          sender_profile_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          message_id?: number
          sender_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_id: string
          last_message: string | null
          participant_ids: string[]
          updated_at: string | null
        }
        Insert: {
          conversation_id?: string
          last_message?: string | null
          participant_ids: string[]
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          last_message?: string | null
          participant_ids?: string[]
          updated_at?: string | null
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
  collection: {
    Tables: {
      collection_items: {
        Row: {
          collection_id: number
          created_at: string
          item_address: number
          item_type: Database["public"]["Enums"]["collection_item_type"]
        }
        Insert: {
          collection_id: number
          created_at?: string
          item_address: number
          item_type?: Database["public"]["Enums"]["collection_item_type"]
        }
        Update: {
          collection_id?: number
          created_at?: string
          item_address?: number
          item_type?: Database["public"]["Enums"]["collection_item_type"]
        }
        Relationships: [
          {
            foreignKeyName: "collection_items_collection_id_fkey"
            columns: ["collection_id"]
            referencedRelation: "collections"
            referencedColumns: ["collection_id"]
          },
        ]
      }
      collections: {
        Row: {
          collection_id: number
          collection_name: string
          created_at: string
          description: string | null
          ended_at: string | null
          image_url: string
          is_competition: boolean
          owner: string
          view: number
          visibility: Database["collection"]["Enums"]["visibility"]
        }
        Insert: {
          collection_id?: number
          collection_name: string
          created_at?: string
          description?: string | null
          ended_at?: string | null
          image_url: string
          is_competition?: boolean
          owner?: string
          view?: number
          visibility?: Database["collection"]["Enums"]["visibility"]
        }
        Update: {
          collection_id?: number
          collection_name?: string
          created_at?: string
          description?: string | null
          ended_at?: string | null
          image_url?: string
          is_competition?: boolean
          owner?: string
          view?: number
          visibility?: Database["collection"]["Enums"]["visibility"]
        }
        Relationships: []
      }
      competition: {
        Row: {
          collection_id: number
          is_official: boolean | null
          pax: number | null
          target: string
        }
        Insert: {
          collection_id?: number
          is_official?: boolean | null
          pax?: number | null
          target: string
        }
        Update: {
          collection_id?: number
          is_official?: boolean | null
          pax?: number | null
          target?: string
        }
        Relationships: [
          {
            foreignKeyName: "competition_collection_id_fkey"
            columns: ["collection_id"]
            referencedRelation: "collections"
            referencedColumns: ["collection_id"]
          },
        ]
      }
      competition_awards: {
        Row: {
          award_name: string
          collection_id: number
          competition_award_id: number
        }
        Insert: {
          award_name: string
          collection_id: number
          competition_award_id?: number
        }
        Update: {
          award_name?: string
          collection_id?: number
          competition_award_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_award_collection_id_fkey"
            columns: ["collection_id"]
            referencedRelation: "collections"
            referencedColumns: ["collection_id"]
          },
        ]
      }
      competition_jurors: {
        Row: {
          collection_id: number
          competition_juror_id: number
          juror_name: string | null
        }
        Insert: {
          collection_id: number
          competition_juror_id?: number
          juror_name?: string | null
        }
        Update: {
          collection_id?: number
          competition_juror_id?: number
          juror_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competition_jurors_collection_id_fkey"
            columns: ["collection_id"]
            referencedRelation: "collections"
            referencedColumns: ["collection_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      visibility: "public" | "partially public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  community: {
    Tables: {
      community_posts: {
        Row: {
          context: string
          created_at: string
          edited_at: string
          post_id: number
          post_name: string | null
          profile_id: string
        }
        Insert: {
          context: string
          created_at?: string
          edited_at?: string
          post_id?: number
          post_name?: string | null
          profile_id?: string
        }
        Update: {
          context?: string
          created_at?: string
          edited_at?: string
          post_id?: number
          post_name?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_posts_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile: {
        Row: {
          created_at: string
          email: string | null
          isTeam: boolean
          link: string[] | null
          owner: string | null
          profile_id: string
          profile_name: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          isTeam: boolean
          link?: string[] | null
          owner?: string | null
          profile_id?: string
          profile_name: string
        }
        Update: {
          created_at?: string
          email?: string | null
          isTeam?: boolean
          link?: string[] | null
          owner?: string | null
          profile_id?: string
          profile_name?: string
        }
        Relationships: []
      }
      profile_permission: {
        Row: {
          profile_id: string
          student_id: string
        }
        Insert: {
          profile_id: string
          student_id?: string
        }
        Update: {
          profile_id?: string
          student_id?: string
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
  enum: {
    Tables: {
      certificates: {
        Row: {
          certificate_id: number
          certificate_name: string
          is_software: boolean
        }
        Insert: {
          certificate_id?: number
          certificate_name: string
          is_software: boolean
        }
        Update: {
          certificate_id?: number
          certificate_name?: string
          is_software?: boolean
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_id: number
          company_name: string
        }
        Insert: {
          company_id?: number
          company_name: string
        }
        Update: {
          company_id?: number
          company_name?: string
        }
        Relationships: []
      }
      competitions: {
        Row: {
          competition_duration: unknown | null
          competition_id: number
          competition_name: string
        }
        Insert: {
          competition_duration?: unknown | null
          competition_id?: number
          competition_name: string
        }
        Update: {
          competition_duration?: unknown | null
          competition_id?: number
          competition_name?: string
        }
        Relationships: []
      }
      job_positions: {
        Row: {
          position_id: number
          position_name: string
        }
        Insert: {
          position_id?: number
          position_name: string
        }
        Update: {
          position_id?: number
          position_name?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          job_id: number
          job_name: string
        }
        Insert: {
          job_id?: number
          job_name: string
        }
        Update: {
          job_id?: number
          job_name?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          language: boolean
          skill_id: number
          skill_name: string
        }
        Insert: {
          language: boolean
          skill_id?: number
          skill_name: string
        }
        Update: {
          language?: boolean
          skill_id?: number
          skill_name?: string
        }
        Relationships: []
      }
      universities: {
        Row: {
          university_department: string
          university_id: number
          university_name: string
        }
        Insert: {
          university_department: string
          university_id?: number
          university_name: string
        }
        Update: {
          university_department?: string
          university_id?: number
          university_name?: string
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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: {
          p_usename: string
        }
        Returns: {
          username: string
          password: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  profile: {
    Tables: {
      profile: {
        Row: {
          created_at: string
          email: string | null
          isTeam: boolean
          link: string[] | null
          owner: string | null
          profile_id: string
          profile_name: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          isTeam: boolean
          link?: string[] | null
          owner?: string | null
          profile_id?: string
          profile_name: string
        }
        Update: {
          created_at?: string
          email?: string | null
          isTeam?: boolean
          link?: string[] | null
          owner?: string | null
          profile_id?: string
          profile_name?: string
        }
        Relationships: []
      }
      profile_competitions: {
        Row: {
          competition_id: number
          prize: string
          profile_id: string | null
        }
        Insert: {
          competition_id?: number
          prize: string
          profile_id?: string | null
        }
        Update: {
          competition_id?: number
          prize?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_competitions_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_introduce: {
        Row: {
          introduce: string
          profile_id: string
        }
        Insert: {
          introduce: string
          profile_id?: string
        }
        Update: {
          introduce?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_introduce_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_link: {
        Row: {
          alt: string | null
          link: string
          profile_id: string
        }
        Insert: {
          alt?: string | null
          link: string
          profile_id?: string
        }
        Update: {
          alt?: string | null
          link?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_link_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_permission: {
        Row: {
          profile_id: string
          student_id: string
        }
        Insert: {
          profile_id: string
          student_id?: string
        }
        Update: {
          profile_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_permission_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profile_skills: {
        Row: {
          profile_id: string
          skill_id: number
        }
        Insert: {
          profile_id?: string
          skill_id?: number
        }
        Update: {
          profile_id?: string
          skill_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Views: {
      v_profile_certificates: {
        Row: {
          certificate_id: number | null
          certificate_name: string | null
          is_software: boolean | null
          profile_id: string | null
        }
        Relationships: []
      }
      v_profile_competitions: {
        Row: {
          competition_duration: unknown | null
          competition_id: number | null
          competition_name: string | null
          prize: string | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_competitions_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      v_profile_skills: {
        Row: {
          language: boolean | null
          profile_id: string | null
          skill_id: number | null
          skill_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_skills_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profile"
            referencedColumns: ["profile_id"]
          },
        ]
      }
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
  project: {
    Tables: {
      markdown_pictures: {
        Row: {
          image_id: number
          "\bimage_url": string
          mark_id: number
        }
        Insert: {
          image_id?: number
          "\bimage_url": string
          mark_id: number
        }
        Update: {
          image_id?: number
          "\bimage_url"?: string
          mark_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "markdown_picture_mark_id_fkey"
            columns: ["mark_id"]
            referencedRelation: "project_markdown"
            referencedColumns: ["mark_id"]
          },
        ]
      }
      project_category: {
        Row: {
          category_id: number
          category_name: string
        }
        Insert: {
          category_id?: number
          category_name: string
        }
        Update: {
          category_id?: number
          category_name?: string
        }
        Relationships: []
      }
      project_contributors: {
        Row: {
          description: string
          project_id: number
          student_id: string
        }
        Insert: {
          description: string
          project_id?: number
          student_id?: string
        }
        Update: {
          description?: string
          project_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_contributor_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_likes: {
        Row: {
          profile_id: string
          project_id: number
        }
        Insert: {
          profile_id?: string
          project_id: number
        }
        Update: {
          profile_id?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_likes_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_markdown: {
        Row: {
          mark_desc: string | null
          mark_id: number
          project_id: number
        }
        Insert: {
          mark_desc?: string | null
          mark_id?: number
          project_id: number
        }
        Update: {
          mark_desc?: string | null
          mark_id?: number
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_markdown_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      project_permissions: {
        Row: {
          authority: boolean | null
          profile_id: string
          project_id: number
        }
        Insert: {
          authority?: boolean | null
          profile_id?: string
          project_id?: number
        }
        Update: {
          authority?: boolean | null
          profile_id?: string
          project_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_permissions_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["project_id"]
          },
        ]
      }
      projects: {
        Row: {
          category_id: number
          created_at: string
          description: string
          project_id: number
          project_name: string
          status: number
        }
        Insert: {
          category_id: number
          created_at?: string
          description: string
          project_id?: number
          project_name: string
          status: number
        }
        Update: {
          category_id?: number
          created_at?: string
          description?: string
          project_id?: number
          project_name?: string
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "project_category"
            referencedColumns: ["category_id"]
          },
        ]
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
  public: {
    Tables: {
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          message_id: number
          sender_profile_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          message_id?: number
          sender_profile_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          message_id?: number
          sender_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            referencedRelation: "conversations"
            referencedColumns: ["conversation_id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_id: string
          last_message: string | null
          participant_ids: string[]
          unread_user_ids: string[]
          updated_at: string | null
        }
        Insert: {
          conversation_id?: string
          last_message?: string | null
          participant_ids: string[]
          unread_user_ids?: string[]
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          last_message?: string | null
          participant_ids?: string[]
          unread_user_ids?: string[]
          updated_at?: string | null
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
      collection_item_type: "collection" | "project"
      visibility: "public" | "partially_public" | "private"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  student: {
    Tables: {
      after_courses: {
        Row: {
          after_course_id: number
          after_course_name: string
          grade: number
        }
        Insert: {
          after_course_id?: number
          after_course_name: string
          grade: number
        }
        Update: {
          after_course_id?: number
          after_course_name?: string
          grade?: number
        }
        Relationships: []
      }
      courses: {
        Row: {
          course_id: number
          course_name: string
          grade: number
        }
        Insert: {
          course_id?: number
          course_name: string
          grade: number
        }
        Update: {
          course_id?: number
          course_name?: string
          grade?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          department_id: number
          department_name: string
        }
        Insert: {
          department_id?: number
          department_name: string
        }
        Update: {
          department_id?: number
          department_name?: string
        }
        Relationships: []
      }
      dream_jobs: {
        Row: {
          company_id: number
          dream_job_id: number
          grade: number
          job_id: number
          student_id: string
        }
        Insert: {
          company_id: number
          dream_job_id: number
          grade: number
          job_id: number
          student_id?: string
        }
        Update: {
          company_id?: number
          dream_job_id?: number
          grade?: number
          job_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dream_job_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      employment_companies: {
        Row: {
          benefit: string
          company_id: number
          company_number: number
          end_date: string | null
          job_id: number
          military_service_status_id: number
          position_id: number
          salary: number
          start_date: string
          student_id: string
        }
        Insert: {
          benefit: string
          company_id: number
          company_number: number
          end_date?: string | null
          job_id: number
          military_service_status_id: number
          position_id: number
          salary: number
          start_date: string
          student_id?: string
        }
        Update: {
          benefit?: string
          company_id?: number
          company_number?: number
          end_date?: string | null
          job_id?: number
          military_service_status_id?: number
          position_id?: number
          salary?: number
          start_date?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employment_companies_military_service_status_id_fkey"
            columns: ["military_service_status_id"]
            referencedRelation: "military_service_statuses"
            referencedColumns: ["military_service_status_id"]
          },
          {
            foreignKeyName: "employment_companies_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      field_training: {
        Row: {
          company_id: number
          created_at: string
          end_date: string
          job_id: number
          lead_or_part: boolean
          start_date: string
          student_id: string
        }
        Insert: {
          company_id: number
          created_at?: string
          end_date: string
          job_id: number
          lead_or_part: boolean
          start_date: string
          student_id?: string
        }
        Update: {
          company_id?: number
          created_at?: string
          end_date?: string
          job_id?: number
          lead_or_part?: boolean
          start_date?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_training_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      middle_schools: {
        Row: {
          middle_school_id: number
          middle_school_name: string
        }
        Insert: {
          middle_school_id?: number
          middle_school_name: string
        }
        Update: {
          middle_school_id?: number
          middle_school_name?: string
        }
        Relationships: []
      }
      military_service_statuses: {
        Row: {
          military_service_status_id: number
          military_service_status_name: string
        }
        Insert: {
          military_service_status_id?: number
          military_service_status_name: string
        }
        Update: {
          military_service_status_id?: number
          military_service_status_name?: string
        }
        Relationships: []
      }
      military_services: {
        Row: {
          created_at: string
          military_service_duration: unknown | null
          military_service_status_id: number
          student_id: string
        }
        Insert: {
          created_at?: string
          military_service_duration?: unknown | null
          military_service_status_id: number
          student_id?: string
        }
        Update: {
          created_at?: string
          military_service_duration?: unknown | null
          military_service_status_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "military_services_military_service_status_id_fkey"
            columns: ["military_service_status_id"]
            referencedRelation: "military_service_statuses"
            referencedColumns: ["military_service_status_id"]
          },
          {
            foreignKeyName: "military_services_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student: {
        Row: {
          birthday: string
          department_id: number
          email: string | null
          graduate_at: string | null
          join_at: string
          name: string
          phone: string
          profile: string
          student_id: string
        }
        Insert: {
          birthday: string
          department_id: number
          email?: string | null
          graduate_at?: string | null
          join_at: string
          name?: string
          phone: string
          profile: string
          student_id?: string
        }
        Update: {
          birthday?: string
          department_id?: number
          email?: string | null
          graduate_at?: string | null
          join_at?: string
          name?: string
          phone?: string
          profile?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "departments"
            referencedColumns: ["department_id"]
          },
        ]
      }
      student_after_courses: {
        Row: {
          after_course_id: number
          student_id: string
        }
        Insert: {
          after_course_id: number
          student_id: string
        }
        Update: {
          after_course_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_after_courses_after_course_id_fkey"
            columns: ["after_course_id"]
            referencedRelation: "after_courses"
            referencedColumns: ["after_course_id"]
          },
          {
            foreignKeyName: "student_after_courses_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_certificates: {
        Row: {
          certificate_id: number
          student_id: string
        }
        Insert: {
          certificate_id: number
          student_id?: string
        }
        Update: {
          certificate_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_certificates_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_competitions: {
        Row: {
          competition_id: number
          prize: string | null
          student_id: string
        }
        Insert: {
          competition_id?: number
          prize?: string | null
          student_id: string
        }
        Update: {
          competition_id?: number
          prize?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_competitions_student_id_fkey2"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_courses: {
        Row: {
          course_id: number
          student_id: string
        }
        Insert: {
          course_id: number
          student_id: string
        }
        Update: {
          course_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_courses_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "student_courses_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_jobs: {
        Row: {
          job_id: number
          student_id: string
        }
        Insert: {
          job_id: number
          student_id: string
        }
        Update: {
          job_id?: number
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_jobs_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_middle_schools: {
        Row: {
          "1st_score": number | null
          "2nd_score": number | null
          middle_school_id: number
          middle_school_score: number | null
          student_id: string
        }
        Insert: {
          "1st_score"?: number | null
          "2nd_score"?: number | null
          middle_school_id: number
          middle_school_score?: number | null
          student_id?: string
        }
        Update: {
          "1st_score"?: number | null
          "2nd_score"?: number | null
          middle_school_id?: number
          middle_school_score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_middle_schools_middle_school_id_fkey"
            columns: ["middle_school_id"]
            referencedRelation: "middle_schools"
            referencedColumns: ["middle_school_id"]
          },
          {
            foreignKeyName: "student_middle_schools_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
      }
      student_universities: {
        Row: {
          created_at: string
          student_id: string
          university_id: number
        }
        Insert: {
          created_at?: string
          student_id: string
          university_id?: number
        }
        Update: {
          created_at?: string
          student_id?: string
          university_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "student_universities_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student"
            referencedColumns: ["student_id"]
          },
        ]
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
  view: {
    Tables: {
      [_ in never]: never
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
