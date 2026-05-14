create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_email text not null unique,
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
