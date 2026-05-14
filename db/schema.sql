create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text not null unique,
  sector text,
  company_size text,
  digital_maturity text,
  created_at timestamptz not null default now()
);

create table if not exists diagnosis_sessions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete set null,
  email text not null,
  raw_answers jsonb not null,
  normalized_inputs jsonb not null,
  calculated_outputs jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists questionnaire_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references diagnosis_sessions(id) on delete cascade,
  question_id text not null,
  block text not null,
  variable text not null,
  question_text text not null,
  raw_value numeric not null,
  normalized_value numeric not null,
  weight numeric not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists kai_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references diagnosis_sessions(id) on delete cascade,
  kai_i_star numeric not null,
  psi_i numeric not null,
  spo_i numeric not null,
  md_i numeric not null,
  va_i numeric not null,
  roi_i numeric,
  ce_i numeric,
  calculated_outputs jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists diagnostic_interpretation_rules (
  id uuid primary key default gen_random_uuid(),
  variable_id text not null,
  variable_name text not null,
  score_min numeric not null,
  score_max numeric not null,
  level_label text not null,
  executive_meaning text not null,
  business_risk text not null,
  probable_cause text not null,
  recommendation_text text not null,
  solution_name text not null,
  solution_url text,
  priority text not null,
  report_tone text not null,
  c_level_summary text not null,
  created_at timestamptz not null default now()
);
