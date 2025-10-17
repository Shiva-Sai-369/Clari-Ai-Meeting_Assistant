-- =============================================
-- Clari Meeting Assistant Database Schema
-- =============================================

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.settings.jwt_secret" = 'your-jwt-secret';

-- Create custom types
CREATE TYPE meeting_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE action_item_status AS ENUM ('pending', 'in_progress', 'completed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');

-- =============================================
-- Profiles Table (extends auth.users)
-- =============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- Meetings Table
-- =============================================
CREATE TABLE public.meetings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status meeting_status DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Meetings policies
CREATE POLICY "Users can view own meetings" ON public.meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own meetings" ON public.meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meetings" ON public.meetings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meetings" ON public.meetings
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- Transcripts Table
-- =============================================
CREATE TABLE public.transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  speaker_name TEXT,
  content TEXT NOT NULL,
  timestamp NUMERIC NOT NULL, -- Seconds from meeting start
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

-- Transcripts policies
CREATE POLICY "Users can view transcripts of own meetings" ON public.transcripts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meetings 
      WHERE meetings.id = transcripts.meeting_id 
      AND meetings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transcripts for own meetings" ON public.transcripts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meetings 
      WHERE meetings.id = meeting_id 
      AND meetings.user_id = auth.uid()
    )
  );

-- =============================================
-- Action Items Table
-- =============================================
CREATE TABLE public.action_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  task TEXT NOT NULL,
  assignee TEXT,
  due_date DATE,
  status action_item_status DEFAULT 'pending',
  priority priority_level DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.action_items ENABLE ROW LEVEL SECURITY;

-- Action Items policies
CREATE POLICY "Users can view action items of own meetings" ON public.action_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.meetings 
      WHERE meetings.id = action_items.meeting_id 
      AND meetings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create action items for own meetings" ON public.action_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.meetings 
      WHERE meetings.id = meeting_id 
      AND meetings.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update action items of own meetings" ON public.action_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.meetings 
      WHERE meetings.id = action_items.meeting_id 
      AND meetings.user_id = auth.uid()
    )
  );

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX idx_transcripts_meeting_id ON public.transcripts(meeting_id);
CREATE INDEX idx_transcripts_timestamp ON public.transcripts(timestamp);
CREATE INDEX idx_action_items_meeting_id ON public.action_items(meeting_id);
CREATE INDEX idx_action_items_due_date ON public.action_items(due_date);

-- =============================================
-- Triggers for updated_at timestamps
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at BEFORE UPDATE ON public.action_items 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- Function to automatically create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Trigger to create profile automatically
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();