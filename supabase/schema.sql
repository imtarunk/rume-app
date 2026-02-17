
-- Create the resumes table
create table resumes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  file_name text,
  content jsonb,
  template_id text default 'template-1'
);

-- Set up Row Level Security (RLS)
alter table resumes enable row level security;

create policy "Users can view their own resumes"
  on resumes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own resumes"
  on resumes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own resumes"
  on resumes for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own resumes"
  on resumes for delete
  using ( auth.uid() = user_id );
