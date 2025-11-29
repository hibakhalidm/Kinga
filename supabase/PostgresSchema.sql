-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  primary_category text, -- e.g., 'NCII', 'Blackmail'
  sentiment_score int, -- stored from local analysis
  urgency_level text, -- 'Critical', 'Moderate', 'Stable'
  platform_context text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- POSTS TABLE
create table posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  content text not null,
  category text,
  sentiment_score int,
  is_anonymous boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table posts enable row level security;

-- Policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Posts are viewable by everyone."
  on posts for select
  using ( true );

create policy "Users can insert their own posts."
  on posts for insert
  with check ( auth.uid() = user_id );

-- MATCHING ENGINE FUNCTION (Jaccard Similarity / Overlap)
-- Finds peers with same category and similar sentiment
create or replace function match_peers(
  target_category text,
  target_sentiment int,
  match_limit int default 5
)
returns setof profiles
language plpgsql
security definer
as $$
begin
  return query
  select *
  from profiles
  where primary_category = target_category
  and id != auth.uid() -- Exclude self
  and (
    -- Avoid matching Critical with Critical (Trauma Dumping Prevention)
    case
      when target_sentiment < -3 then sentiment_score > -1 -- Match Critical with Stable
      else abs(sentiment_score - target_sentiment) <= 3 -- Match similar otherwise
    end
  )
  order by abs(sentiment_score - target_sentiment) asc
  limit match_limit;
end;
$$;
