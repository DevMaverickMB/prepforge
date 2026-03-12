-- PrepForge Complete Database Schema
-- Run this in Supabase SQL Editor

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  "current_role" text default 'AI Engineer',
  experience_years numeric default 1,
  target_role text default 'Applied AI / ML Engineer',
  prep_start_date date default current_date,
  target_interview_month text default 'May-June 2026',
  daily_streak int default 0,
  longest_streak int default 0,
  last_active_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 2. LEETCODE PROBLEMS
-- ============================================================
create table if not exists leetcode_problems (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  problem_number int not null,
  title text not null,
  leetcode_url text not null,
  difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')) not null,
  status text check (status in ('todo', 'attempted', 'solved', 'review')) default 'todo',
  primary_pattern text,
  secondary_patterns text[],
  company_tags text[],
  topics text[],
  attempts int default 0,
  first_solved_at timestamptz,
  last_attempted_at timestamptz,
  best_time_minutes numeric,
  best_time_complexity text,
  best_space_complexity text,
  confidence_level int check (confidence_level between 1 and 5),
  needs_revision boolean default false,
  next_review_date date,
  approach_notes text,
  key_insight text,
  mistakes_made text,
  similar_problems int[],
  source text,
  week_number int,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_lc_user on leetcode_problems(user_id);
create index if not exists idx_lc_status on leetcode_problems(user_id, status);
create index if not exists idx_lc_difficulty on leetcode_problems(user_id, difficulty);
create index if not exists idx_lc_pattern on leetcode_problems(user_id, primary_pattern);
create index if not exists idx_lc_revision on leetcode_problems(user_id, needs_revision) where needs_revision = true;
create index if not exists idx_lc_company on leetcode_problems using gin(company_tags);

-- ============================================================
-- 3. LC ATTEMPTS
-- ============================================================
create table if not exists lc_attempts (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid references leetcode_problems(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  attempted_at timestamptz default now(),
  time_taken_minutes numeric,
  solved boolean default false,
  needed_hint boolean default false,
  used_editorial boolean default false,
  approach text,
  notes text
);

-- ============================================================
-- 4. STUDY TOPICS
-- ============================================================
create table if not exists study_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  category text check (category in (
    'ml_fundamentals', 'deep_learning', 'llm_genai',
    'system_design', 'ml_system_design', 'statistics',
    'distributed_systems', 'mlops'
  )) not null,
  topic_name text not null,
  subtopics text[],
  status text check (status in ('not_started', 'in_progress', 'completed', 'needs_review')) default 'not_started',
  confidence_level int check (confidence_level between 1 and 5),
  resource_links text[],
  notes text,
  can_explain_to_interviewer boolean default false,
  can_implement_from_scratch boolean default false,
  practiced_interview_questions boolean default false,
  week_number int,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 5. PROJECTS
-- ============================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  project_type text,
  status text check (status in ('planning', 'in_progress', 'mvp_done', 'deployed', 'polished')) default 'planning',
  progress_percent int default 0 check (progress_percent between 0 and 100),
  tech_stack text[],
  github_url text,
  demo_url text,
  blog_post_url text,
  documentation_url text,
  milestones jsonb default '[]'::jsonb,
  has_readme boolean default false,
  has_architecture_diagram boolean default false,
  has_demo_video boolean default false,
  has_tests boolean default false,
  has_cicd boolean default false,
  is_deployed boolean default false,
  impact_metrics text[],
  start_date date,
  target_completion_date date,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 6. PROJECT TASKS
-- ============================================================
create table if not exists project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  sort_order int default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- ============================================================
-- 7. COMPANIES
-- ============================================================
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  tier text check (tier in ('tier_1', 'tier_2', 'tier_3')),
  careers_page_url text,
  engineering_blog_url text,
  application_status text check (application_status in (
    'researching', 'ready_to_apply', 'applied', 'referral_sent',
    'oa_received', 'phone_screen', 'onsite', 'offer', 'rejected', 'withdrawn'
  )) default 'researching',
  applied_date date,
  applied_via text,
  job_listing_url text,
  role_title text,
  referrer_name text,
  referrer_linkedin text,
  referral_status text check (referral_status in ('none', 'requested', 'confirmed', 'submitted')),
  referral_date date,
  interview_rounds jsonb default '[]'::jsonb,
  ai_products_notes text,
  recent_blog_posts text[],
  interview_tips text,
  expected_ctc_range text,
  offer_ctc text,
  notes text,
  priority int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 8. DAILY LOGS
-- ============================================================
create table if not exists daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  log_date date not null default current_date,
  week_number int,
  morning_task text,
  morning_done boolean default false,
  evening_7pm_task text,
  evening_7pm_done boolean default false,
  evening_9pm_task text,
  evening_9pm_done boolean default false,
  evening_10pm_task text,
  evening_10pm_done boolean default false,
  is_weekend boolean default false,
  weekend_blocks jsonb,
  total_hours_studied numeric default 0,
  lc_problems_solved int default 0,
  energy_level int check (energy_level between 1 and 5),
  productivity_rating int check (productivity_rating between 1 and 5),
  wins text,
  blockers text,
  tomorrow_focus text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, log_date)
);

-- ============================================================
-- 9. MOCK INTERVIEWS
-- ============================================================
create table if not exists mock_interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  date date not null,
  type text check (type in ('coding', 'ml_theory', 'ml_system_design', 'behavioral', 'full_loop')),
  platform text,
  overall_score int check (overall_score between 1 and 5),
  coding_score int check (coding_score between 1 and 5),
  communication_score int check (communication_score between 1 and 5),
  questions_asked text[],
  feedback text,
  areas_to_improve text[],
  created_at timestamptz default now()
);

-- ============================================================
-- 10. RESOURCES
-- ============================================================
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  url text not null,
  category text,
  topic text,
  is_completed boolean default false,
  progress_percent int default 0,
  notes text,
  is_favorite boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 11. WEEKLY REVIEWS
-- ============================================================
create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  week_number int not null,
  review_date date not null,
  lc_problems_solved_this_week int default 0,
  total_hours_studied numeric default 0,
  tasks_completed int default 0,
  tasks_planned int default 0,
  biggest_win text,
  biggest_challenge text,
  key_learnings text,
  next_week_priorities text[],
  overall_satisfaction int check (overall_satisfaction between 1 and 5),
  on_track boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- 12. BEHAVIORAL STORIES
-- ============================================================
create table if not exists behavioral_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  category text,
  situation text,
  task text,
  action text,
  result text,
  amazon_lp text[],
  applicable_companies text[],
  confidence_level int check (confidence_level between 1 and 5),
  practiced_count int default 0,
  last_practiced_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- 13. ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table leetcode_problems enable row level security;
alter table lc_attempts enable row level security;
alter table study_topics enable row level security;
alter table projects enable row level security;
alter table project_tasks enable row level security;
alter table companies enable row level security;
alter table daily_logs enable row level security;
alter table mock_interviews enable row level security;
alter table resources enable row level security;
alter table weekly_reviews enable row level security;
alter table behavioral_stories enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Generic policy for all other tables
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'leetcode_problems', 'lc_attempts', 'study_topics',
      'projects', 'project_tasks', 'companies', 'daily_logs',
      'mock_interviews', 'resources', 'weekly_reviews', 'behavioral_stories'
    ])
  loop
    execute format('create policy "Users can view own %I" on %I for select using (auth.uid() = user_id)', tbl, tbl);
    execute format('create policy "Users can insert own %I" on %I for insert with check (auth.uid() = user_id)', tbl, tbl);
    execute format('create policy "Users can update own %I" on %I for update using (auth.uid() = user_id)', tbl, tbl);
    execute format('create policy "Users can delete own %I" on %I for delete using (auth.uid() = user_id)', tbl, tbl);
  end loop;
end;
$$;

-- ============================================================
-- 14. DATABASE FUNCTIONS
-- ============================================================

-- Streak calculator
create or replace function get_current_streak(p_user_id uuid)
returns int as $$
declare
  streak int := 0;
  check_date date := current_date;
  log_exists boolean;
begin
  loop
    select exists(
      select 1 from daily_logs
      where user_id = p_user_id
        and log_date = check_date
        and morning_done = true
        and evening_7pm_done = true
        and evening_9pm_done = true
        and evening_10pm_done = true
    ) into log_exists;

    if not log_exists then exit; end if;

    streak := streak + 1;
    check_date := check_date - 1;
  end loop;

  return streak;
end;
$$ language plpgsql security definer;

-- Readiness score calculator
create or replace function get_readiness_score(p_user_id uuid)
returns numeric as $$
declare
  lc_count int;
  ml_count int;
  dl_count int;
  llm_count int;
  project_count int;
  mock_count int;
  app_count int;
  ref_count int;
  score numeric;
begin
  select count(*) into lc_count from leetcode_problems where user_id = p_user_id and status = 'solved';
  select count(*) into ml_count from study_topics where user_id = p_user_id and category = 'ml_fundamentals' and status = 'completed';
  select count(*) into dl_count from study_topics where user_id = p_user_id and category = 'deep_learning' and status = 'completed';
  select count(*) into llm_count from study_topics where user_id = p_user_id and category = 'llm_genai' and status = 'completed';
  select count(*) into project_count from projects where user_id = p_user_id and status in ('deployed', 'polished');
  select count(*) into mock_count from mock_interviews where user_id = p_user_id;
  select count(*) into app_count from companies where user_id = p_user_id and application_status not in ('researching', 'ready_to_apply');
  select count(*) into ref_count from companies where user_id = p_user_id and referral_status = 'submitted';

  score := least(lc_count::numeric / 350, 1) * 25 +
           least(ml_count::numeric / 12, 1) * 15 +
           least(dl_count::numeric / 10, 1) * 10 +
           least(llm_count::numeric / 12, 1) * 15 +
           least(project_count::numeric / 3, 1) * 15 +
           least(mock_count::numeric / 12, 1) * 10 +
           least(app_count::numeric / 70, 1) * 5 +
           least(ref_count::numeric / 7, 1) * 5;

  return round(score, 1);
end;
$$ language plpgsql security definer;

-- ============================================================
-- 15. TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to all relevant tables
do $$
declare
  tbl text;
begin
  for tbl in
    select unnest(array[
      'profiles', 'leetcode_problems', 'study_topics',
      'projects', 'companies', 'daily_logs', 'behavioral_stories'
    ])
  loop
    execute format('
      create or replace trigger update_%I_updated_at
        before update on %I
        for each row execute function update_updated_at()
    ', tbl, tbl);
  end loop;
end;
$$;

-- Enable realtime on key tables
alter publication supabase_realtime add table daily_logs;
alter publication supabase_realtime add table leetcode_problems;
