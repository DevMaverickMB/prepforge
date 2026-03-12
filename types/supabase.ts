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
          current_role: string;
          experience_years: number;
          target_role: string;
          prep_start_date: string;
          target_interview_month: string;
          daily_streak: number;
          longest_streak: number;
          last_active_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          current_role?: string;
          experience_years?: number;
          target_role?: string;
          prep_start_date?: string;
          target_interview_month?: string;
          daily_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          current_role?: string;
          experience_years?: number;
          target_role?: string;
          prep_start_date?: string;
          target_interview_month?: string;
          daily_streak?: number;
          longest_streak?: number;
          last_active_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leetcode_problems: {
        Row: {
          id: string;
          user_id: string;
          problem_number: number;
          title: string;
          leetcode_url: string;
          difficulty: "Easy" | "Medium" | "Hard";
          status: "todo" | "attempted" | "solved" | "review";
          primary_pattern: string | null;
          secondary_patterns: string[] | null;
          company_tags: string[] | null;
          topics: string[] | null;
          attempts: number;
          first_solved_at: string | null;
          last_attempted_at: string | null;
          best_time_minutes: number | null;
          best_time_complexity: string | null;
          best_space_complexity: string | null;
          confidence_level: number | null;
          needs_revision: boolean;
          next_review_date: string | null;
          approach_notes: string | null;
          key_insight: string | null;
          mistakes_made: string | null;
          similar_problems: number[] | null;
          source: string | null;
          week_number: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_number: number;
          title: string;
          leetcode_url: string;
          difficulty: "Easy" | "Medium" | "Hard";
          status?: "todo" | "attempted" | "solved" | "review";
          primary_pattern?: string | null;
          secondary_patterns?: string[] | null;
          company_tags?: string[] | null;
          topics?: string[] | null;
          attempts?: number;
          first_solved_at?: string | null;
          last_attempted_at?: string | null;
          best_time_minutes?: number | null;
          best_time_complexity?: string | null;
          best_space_complexity?: string | null;
          confidence_level?: number | null;
          needs_revision?: boolean;
          next_review_date?: string | null;
          approach_notes?: string | null;
          key_insight?: string | null;
          mistakes_made?: string | null;
          similar_problems?: number[] | null;
          source?: string | null;
          week_number?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_number?: number;
          title?: string;
          leetcode_url?: string;
          difficulty?: "Easy" | "Medium" | "Hard";
          status?: "todo" | "attempted" | "solved" | "review";
          primary_pattern?: string | null;
          secondary_patterns?: string[] | null;
          company_tags?: string[] | null;
          topics?: string[] | null;
          attempts?: number;
          first_solved_at?: string | null;
          last_attempted_at?: string | null;
          best_time_minutes?: number | null;
          best_time_complexity?: string | null;
          best_space_complexity?: string | null;
          confidence_level?: number | null;
          needs_revision?: boolean;
          next_review_date?: string | null;
          approach_notes?: string | null;
          key_insight?: string | null;
          mistakes_made?: string | null;
          similar_problems?: number[] | null;
          source?: string | null;
          week_number?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lc_attempts: {
        Row: {
          id: string;
          problem_id: string;
          user_id: string;
          attempted_at: string;
          time_taken_minutes: number | null;
          solved: boolean;
          needed_hint: boolean;
          used_editorial: boolean;
          approach: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          problem_id: string;
          user_id: string;
          attempted_at?: string;
          time_taken_minutes?: number | null;
          solved?: boolean;
          needed_hint?: boolean;
          used_editorial?: boolean;
          approach?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          problem_id?: string;
          user_id?: string;
          attempted_at?: string;
          time_taken_minutes?: number | null;
          solved?: boolean;
          needed_hint?: boolean;
          used_editorial?: boolean;
          approach?: string | null;
          notes?: string | null;
        };
        Relationships: [];
      };
      study_topics: {
        Row: {
          id: string;
          user_id: string;
          category:
            | "ml_fundamentals"
            | "deep_learning"
            | "llm_genai"
            | "system_design"
            | "ml_system_design"
            | "statistics"
            | "distributed_systems"
            | "mlops";
          topic_name: string;
          subtopics: string[] | null;
          status: "not_started" | "in_progress" | "completed" | "needs_review";
          confidence_level: number | null;
          resource_links: string[] | null;
          notes: string | null;
          can_explain_to_interviewer: boolean;
          can_implement_from_scratch: boolean;
          practiced_interview_questions: boolean;
          week_number: number | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category:
            | "ml_fundamentals"
            | "deep_learning"
            | "llm_genai"
            | "system_design"
            | "ml_system_design"
            | "statistics"
            | "distributed_systems"
            | "mlops";
          topic_name: string;
          subtopics?: string[] | null;
          status?: "not_started" | "in_progress" | "completed" | "needs_review";
          confidence_level?: number | null;
          resource_links?: string[] | null;
          notes?: string | null;
          can_explain_to_interviewer?: boolean;
          can_implement_from_scratch?: boolean;
          practiced_interview_questions?: boolean;
          week_number?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?:
            | "ml_fundamentals"
            | "deep_learning"
            | "llm_genai"
            | "system_design"
            | "ml_system_design"
            | "statistics"
            | "distributed_systems"
            | "mlops";
          topic_name?: string;
          subtopics?: string[] | null;
          status?: "not_started" | "in_progress" | "completed" | "needs_review";
          confidence_level?: number | null;
          resource_links?: string[] | null;
          notes?: string | null;
          can_explain_to_interviewer?: boolean;
          can_implement_from_scratch?: boolean;
          practiced_interview_questions?: boolean;
          week_number?: number | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          project_type: string | null;
          status: "planning" | "in_progress" | "mvp_done" | "deployed" | "polished";
          progress_percent: number;
          tech_stack: string[] | null;
          github_url: string | null;
          demo_url: string | null;
          blog_post_url: string | null;
          documentation_url: string | null;
          milestones: ProjectMilestone[];
          has_readme: boolean;
          has_architecture_diagram: boolean;
          has_demo_video: boolean;
          has_tests: boolean;
          has_cicd: boolean;
          is_deployed: boolean;
          impact_metrics: string[] | null;
          start_date: string | null;
          target_completion_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          project_type?: string | null;
          status?: "planning" | "in_progress" | "mvp_done" | "deployed" | "polished";
          progress_percent?: number;
          tech_stack?: string[] | null;
          github_url?: string | null;
          demo_url?: string | null;
          blog_post_url?: string | null;
          documentation_url?: string | null;
          milestones?: ProjectMilestone[];
          has_readme?: boolean;
          has_architecture_diagram?: boolean;
          has_demo_video?: boolean;
          has_tests?: boolean;
          has_cicd?: boolean;
          is_deployed?: boolean;
          impact_metrics?: string[] | null;
          start_date?: string | null;
          target_completion_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          project_type?: string | null;
          status?: "planning" | "in_progress" | "mvp_done" | "deployed" | "polished";
          progress_percent?: number;
          tech_stack?: string[] | null;
          github_url?: string | null;
          demo_url?: string | null;
          blog_post_url?: string | null;
          documentation_url?: string | null;
          milestones?: ProjectMilestone[];
          has_readme?: boolean;
          has_architecture_diagram?: boolean;
          has_demo_video?: boolean;
          has_tests?: boolean;
          has_cicd?: boolean;
          is_deployed?: boolean;
          impact_metrics?: string[] | null;
          start_date?: string | null;
          target_completion_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_tasks: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          title: string;
          description: string | null;
          status: "todo" | "in_progress" | "done";
          priority: "low" | "medium" | "high";
          sort_order: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          title: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "done";
          priority?: "low" | "medium" | "high";
          sort_order?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          status?: "todo" | "in_progress" | "done";
          priority?: "low" | "medium" | "high";
          sort_order?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          tier: "tier_1" | "tier_2" | "tier_3" | null;
          careers_page_url: string | null;
          engineering_blog_url: string | null;
          application_status:
            | "researching"
            | "ready_to_apply"
            | "applied"
            | "referral_sent"
            | "oa_received"
            | "phone_screen"
            | "onsite"
            | "offer"
            | "rejected"
            | "withdrawn";
          applied_date: string | null;
          applied_via: string | null;
          job_listing_url: string | null;
          role_title: string | null;
          referrer_name: string | null;
          referrer_linkedin: string | null;
          referral_status: "none" | "requested" | "confirmed" | "submitted" | null;
          referral_date: string | null;
          interview_rounds: InterviewRound[];
          ai_products_notes: string | null;
          recent_blog_posts: string[] | null;
          interview_tips: string | null;
          expected_ctc_range: string | null;
          offer_ctc: string | null;
          notes: string | null;
          priority: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          tier?: "tier_1" | "tier_2" | "tier_3" | null;
          careers_page_url?: string | null;
          engineering_blog_url?: string | null;
          application_status?:
            | "researching"
            | "ready_to_apply"
            | "applied"
            | "referral_sent"
            | "oa_received"
            | "phone_screen"
            | "onsite"
            | "offer"
            | "rejected"
            | "withdrawn";
          applied_date?: string | null;
          applied_via?: string | null;
          job_listing_url?: string | null;
          role_title?: string | null;
          referrer_name?: string | null;
          referrer_linkedin?: string | null;
          referral_status?: "none" | "requested" | "confirmed" | "submitted" | null;
          referral_date?: string | null;
          interview_rounds?: InterviewRound[];
          ai_products_notes?: string | null;
          recent_blog_posts?: string[] | null;
          interview_tips?: string | null;
          expected_ctc_range?: string | null;
          offer_ctc?: string | null;
          notes?: string | null;
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          tier?: "tier_1" | "tier_2" | "tier_3" | null;
          careers_page_url?: string | null;
          engineering_blog_url?: string | null;
          application_status?:
            | "researching"
            | "ready_to_apply"
            | "applied"
            | "referral_sent"
            | "oa_received"
            | "phone_screen"
            | "onsite"
            | "offer"
            | "rejected"
            | "withdrawn";
          applied_date?: string | null;
          applied_via?: string | null;
          job_listing_url?: string | null;
          role_title?: string | null;
          referrer_name?: string | null;
          referrer_linkedin?: string | null;
          referral_status?: "none" | "requested" | "confirmed" | "submitted" | null;
          referral_date?: string | null;
          interview_rounds?: InterviewRound[];
          ai_products_notes?: string | null;
          recent_blog_posts?: string[] | null;
          interview_tips?: string | null;
          expected_ctc_range?: string | null;
          offer_ctc?: string | null;
          notes?: string | null;
          priority?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_logs: {
        Row: {
          id: string;
          user_id: string;
          log_date: string;
          week_number: number | null;
          morning_task: string | null;
          morning_done: boolean;
          evening_7pm_task: string | null;
          evening_7pm_done: boolean;
          evening_9pm_task: string | null;
          evening_9pm_done: boolean;
          evening_10pm_task: string | null;
          evening_10pm_done: boolean;
          is_weekend: boolean;
          weekend_blocks: WeekendBlock[] | null;
          total_hours_studied: number;
          lc_problems_solved: number;
          energy_level: number | null;
          productivity_rating: number | null;
          wins: string | null;
          blockers: string | null;
          tomorrow_focus: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_date?: string;
          week_number?: number | null;
          morning_task?: string | null;
          morning_done?: boolean;
          evening_7pm_task?: string | null;
          evening_7pm_done?: boolean;
          evening_9pm_task?: string | null;
          evening_9pm_done?: boolean;
          evening_10pm_task?: string | null;
          evening_10pm_done?: boolean;
          is_weekend?: boolean;
          weekend_blocks?: WeekendBlock[] | null;
          total_hours_studied?: number;
          lc_problems_solved?: number;
          energy_level?: number | null;
          productivity_rating?: number | null;
          wins?: string | null;
          blockers?: string | null;
          tomorrow_focus?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_date?: string;
          week_number?: number | null;
          morning_task?: string | null;
          morning_done?: boolean;
          evening_7pm_task?: string | null;
          evening_7pm_done?: boolean;
          evening_9pm_task?: string | null;
          evening_9pm_done?: boolean;
          evening_10pm_task?: string | null;
          evening_10pm_done?: boolean;
          is_weekend?: boolean;
          weekend_blocks?: WeekendBlock[] | null;
          total_hours_studied?: number;
          lc_problems_solved?: number;
          energy_level?: number | null;
          productivity_rating?: number | null;
          wins?: string | null;
          blockers?: string | null;
          tomorrow_focus?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      mock_interviews: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          type: "coding" | "ml_theory" | "ml_system_design" | "behavioral" | "full_loop";
          platform: string | null;
          overall_score: number | null;
          coding_score: number | null;
          communication_score: number | null;
          questions_asked: string[] | null;
          feedback: string | null;
          areas_to_improve: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          type: "coding" | "ml_theory" | "ml_system_design" | "behavioral" | "full_loop";
          platform?: string | null;
          overall_score?: number | null;
          coding_score?: number | null;
          communication_score?: number | null;
          questions_asked?: string[] | null;
          feedback?: string | null;
          areas_to_improve?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          type?: "coding" | "ml_theory" | "ml_system_design" | "behavioral" | "full_loop";
          platform?: string | null;
          overall_score?: number | null;
          coding_score?: number | null;
          communication_score?: number | null;
          questions_asked?: string[] | null;
          feedback?: string | null;
          areas_to_improve?: string[] | null;
          created_at?: string;
        };
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          category: string | null;
          topic: string | null;
          is_completed: boolean;
          progress_percent: number;
          notes: string | null;
          is_favorite: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          category?: string | null;
          topic?: string | null;
          is_completed?: boolean;
          progress_percent?: number;
          notes?: string | null;
          is_favorite?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          category?: string | null;
          topic?: string | null;
          is_completed?: boolean;
          progress_percent?: number;
          notes?: string | null;
          is_favorite?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      weekly_reviews: {
        Row: {
          id: string;
          user_id: string;
          week_number: number;
          review_date: string;
          lc_problems_solved_this_week: number;
          total_hours_studied: number;
          tasks_completed: number;
          tasks_planned: number;
          biggest_win: string | null;
          biggest_challenge: string | null;
          key_learnings: string | null;
          next_week_priorities: string[] | null;
          overall_satisfaction: number | null;
          on_track: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          week_number: number;
          review_date: string;
          lc_problems_solved_this_week?: number;
          total_hours_studied?: number;
          tasks_completed?: number;
          tasks_planned?: number;
          biggest_win?: string | null;
          biggest_challenge?: string | null;
          key_learnings?: string | null;
          next_week_priorities?: string[] | null;
          overall_satisfaction?: number | null;
          on_track?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          week_number?: number;
          review_date?: string;
          lc_problems_solved_this_week?: number;
          total_hours_studied?: number;
          tasks_completed?: number;
          tasks_planned?: number;
          biggest_win?: string | null;
          biggest_challenge?: string | null;
          key_learnings?: string | null;
          next_week_priorities?: string[] | null;
          overall_satisfaction?: number | null;
          on_track?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      behavioral_stories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: string | null;
          situation: string | null;
          task: string | null;
          action: string | null;
          result: string | null;
          amazon_lp: string[] | null;
          applicable_companies: string[] | null;
          confidence_level: number | null;
          practiced_count: number;
          last_practiced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category?: string | null;
          situation?: string | null;
          task?: string | null;
          action?: string | null;
          result?: string | null;
          amazon_lp?: string[] | null;
          applicable_companies?: string[] | null;
          confidence_level?: number | null;
          practiced_count?: number;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: string | null;
          situation?: string | null;
          task?: string | null;
          action?: string | null;
          result?: string | null;
          amazon_lp?: string[] | null;
          applicable_companies?: string[] | null;
          confidence_level?: number | null;
          practiced_count?: number;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      get_current_streak: {
        Args: { p_user_id: string };
        Returns: number;
      };
      get_readiness_score: {
        Args: { p_user_id: string };
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: {};
  };
}

// JSONB field types
export interface ProjectMilestone {
  title: string;
  done: boolean;
  date: string | null;
}

export interface InterviewRound {
  round_name: string;
  date: string | null;
  interviewer?: string | null;
  topics?: string[];
  went_well: string | null;
  to_improve: string | null;
  result: string | null;
}

export interface WeekendBlock {
  time: string;
  task: string;
  done: boolean;
}

// Convenience aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type LeetCodeProblem = Database["public"]["Tables"]["leetcode_problems"]["Row"];
export type LCAttempt = Database["public"]["Tables"]["lc_attempts"]["Row"];
export type StudyTopic = Database["public"]["Tables"]["study_topics"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectTask = Database["public"]["Tables"]["project_tasks"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type DailyLog = Database["public"]["Tables"]["daily_logs"]["Row"];
export type MockInterview = Database["public"]["Tables"]["mock_interviews"]["Row"];
export type Resource = Database["public"]["Tables"]["resources"]["Row"];
export type WeeklyReview = Database["public"]["Tables"]["weekly_reviews"]["Row"];
export type BehavioralStory = Database["public"]["Tables"]["behavioral_stories"]["Row"];
