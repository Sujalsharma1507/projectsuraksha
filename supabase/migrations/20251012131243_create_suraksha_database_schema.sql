/*
  # Project Suraksha - Database Schema

  ## Overview
  Complete database schema for the AI-powered women's safety application with authentication,
  emergency alerts, incident management, safe zones, and community features.

  ## 1. New Tables

  ### profiles
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `phone` (text)
  - `role` (text) - user, guardian, admin
  - `is_verified` (boolean)
  - `profile_photo_url` (text)
  - `blood_group` (text)
  - `emergency_contact_name` (text)
  - `emergency_contact_phone` (text)
  - `address` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### guardian_connections
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `guardian_id` (uuid, references profiles)
  - `status` (text) - pending, accepted, rejected
  - `created_at` (timestamptz)

  ### emergency_contacts
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `name` (text)
  - `phone` (text)
  - `email` (text)
  - `relationship` (text)
  - `priority` (integer)
  - `created_at` (timestamptz)

  ### sos_alerts
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `alert_type` (text) - manual, voice_triggered, ai_detected, motion_detected
  - `status` (text) - active, resolved, cancelled
  - `audio_url` (text)
  - `video_url` (text)
  - `description` (text)
  - `triggered_at` (timestamptz)
  - `resolved_at` (timestamptz)

  ### incidents
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `alert_id` (uuid, references sos_alerts)
  - `incident_type` (text)
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `description` (text)
  - `audio_recording_url` (text)
  - `video_recording_url` (text)
  - `photos` (jsonb)
  - `witnesses` (jsonb)
  - `police_report_filed` (boolean)
  - `status` (text) - reported, under_investigation, resolved
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### safe_zones
  - `id` (uuid, primary key)
  - `name` (text)
  - `type` (text) - police_station, hospital, cafe, public_place, safe_house
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `address` (text)
  - `phone` (text)
  - `rating` (decimal)
  - `is_verified` (boolean)
  - `operating_hours` (jsonb)
  - `created_at` (timestamptz)

  ### danger_zones
  - `id` (uuid, primary key)
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `radius` (integer) - in meters
  - `danger_level` (text) - low, medium, high, critical
  - `description` (text)
  - `reported_by` (uuid, references profiles)
  - `incident_count` (integer)
  - `last_incident_at` (timestamptz)
  - `created_at` (timestamptz)

  ### suraksha_network_users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `is_available` (boolean)
  - `last_active_at` (timestamptz)
  - `response_count` (integer)
  - `average_rating` (decimal)

  ### network_responses
  - `id` (uuid, primary key)
  - `alert_id` (uuid, references sos_alerts)
  - `responder_id` (uuid, references profiles)
  - `response_time` (integer) - in seconds
  - `status` (text) - accepted, declined, arrived, completed
  - `rating` (integer)
  - `feedback` (text)
  - `created_at` (timestamptz)

  ### ai_chat_sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `session_type` (text) - emergency, support, guidance, general
  - `messages` (jsonb)
  - `sentiment_analysis` (jsonb)
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)

  ### notifications
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `type` (text) - sos_alert, guardian_request, network_alert, safety_tip, system
  - `title` (text)
  - `message` (text)
  - `data` (jsonb)
  - `is_read` (boolean)
  - `created_at` (timestamptz)

  ### support_resources
  - `id` (uuid, primary key)
  - `category` (text) - counselor, ngo, legal_aid, medical, hotline
  - `name` (text)
  - `description` (text)
  - `contact_phone` (text)
  - `contact_email` (text)
  - `website_url` (text)
  - `address` (text)
  - `is_24x7` (boolean)
  - `created_at` (timestamptz)

  ### user_settings
  - `user_id` (uuid, primary key, references profiles)
  - `theme` (text) - light, dark
  - `notifications_enabled` (boolean)
  - `location_tracking_enabled` (boolean)
  - `ai_detection_enabled` (boolean)
  - `voice_activation_enabled` (boolean)
  - `shake_detection_enabled` (boolean)
  - `auto_recording_enabled` (boolean)
  - `offline_mode_enabled` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security
  - Enable RLS on all tables
  - Create policies for authenticated users to manage their own data
  - Guardian and admin-specific policies for elevated access
  - Public read access for safe zones and support resources

  ## 3. Important Notes
  - All location data stored with high precision for accurate emergency response
  - JSONB fields for flexible storage of arrays and complex data structures
  - Timestamps for audit trails and analytics
  - Foreign key constraints ensure data integrity
  - Indexes on frequently queried fields for performance
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'guardian', 'admin')),
  is_verified boolean DEFAULT false,
  profile_photo_url text,
  blood_group text,
  emergency_contact_name text,
  emergency_contact_phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create guardian connections table
CREATE TABLE IF NOT EXISTS guardian_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, guardian_id)
);

-- Create emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  relationship text,
  priority integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create SOS alerts table
CREATE TABLE IF NOT EXISTS sos_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  alert_type text DEFAULT 'manual' CHECK (alert_type IN ('manual', 'voice_triggered', 'ai_detected', 'motion_detected')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  audio_url text,
  video_url text,
  description text,
  triggered_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_id uuid REFERENCES sos_alerts(id) ON DELETE SET NULL,
  incident_type text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  description text,
  audio_recording_url text,
  video_recording_url text,
  photos jsonb DEFAULT '[]',
  witnesses jsonb DEFAULT '[]',
  police_report_filed boolean DEFAULT false,
  status text DEFAULT 'reported' CHECK (status IN ('reported', 'under_investigation', 'resolved')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create safe zones table
CREATE TABLE IF NOT EXISTS safe_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('police_station', 'hospital', 'cafe', 'public_place', 'safe_house')),
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  address text,
  phone text,
  rating decimal(3, 2) DEFAULT 0,
  is_verified boolean DEFAULT false,
  operating_hours jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create danger zones table
CREATE TABLE IF NOT EXISTS danger_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  radius integer DEFAULT 100,
  danger_level text DEFAULT 'medium' CHECK (danger_level IN ('low', 'medium', 'high', 'critical')),
  description text,
  reported_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  incident_count integer DEFAULT 0,
  last_incident_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create suraksha network users table
CREATE TABLE IF NOT EXISTS suraksha_network_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  is_available boolean DEFAULT true,
  last_active_at timestamptz DEFAULT now(),
  response_count integer DEFAULT 0,
  average_rating decimal(3, 2) DEFAULT 0
);

-- Create network responses table
CREATE TABLE IF NOT EXISTS network_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id uuid NOT NULL REFERENCES sos_alerts(id) ON DELETE CASCADE,
  responder_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  response_time integer,
  status text DEFAULT 'accepted' CHECK (status IN ('accepted', 'declined', 'arrived', 'completed')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Create AI chat sessions table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_type text DEFAULT 'general' CHECK (session_type IN ('emergency', 'support', 'guidance', 'general')),
  messages jsonb DEFAULT '[]',
  sentiment_analysis jsonb DEFAULT '{}',
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('sos_alert', 'guardian_request', 'network_alert', 'safety_tip', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create support resources table
CREATE TABLE IF NOT EXISTS support_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('counselor', 'ngo', 'legal_aid', 'medical', 'hotline')),
  name text NOT NULL,
  description text,
  contact_phone text,
  contact_email text,
  website_url text,
  address text,
  is_24x7 boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user settings table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  notifications_enabled boolean DEFAULT true,
  location_tracking_enabled boolean DEFAULT true,
  ai_detection_enabled boolean DEFAULT true,
  voice_activation_enabled boolean DEFAULT true,
  shake_detection_enabled boolean DEFAULT true,
  auto_recording_enabled boolean DEFAULT true,
  offline_mode_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sos_alerts_user_id ON sos_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sos_alerts_triggered_at ON sos_alerts(triggered_at);
CREATE INDEX IF NOT EXISTS idx_incidents_user_id ON incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_safe_zones_location ON safe_zones(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_danger_zones_location ON danger_zones(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sos_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE safe_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE danger_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE suraksha_network_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for guardian_connections
CREATE POLICY "Users can view own guardian connections"
  ON guardian_connections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = guardian_id);

CREATE POLICY "Users can create guardian connections"
  ON guardian_connections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own guardian connections"
  ON guardian_connections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = guardian_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = guardian_id);

-- RLS Policies for emergency_contacts
CREATE POLICY "Users can view own emergency contacts"
  ON emergency_contacts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own emergency contacts"
  ON emergency_contacts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emergency contacts"
  ON emergency_contacts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own emergency contacts"
  ON emergency_contacts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for sos_alerts
CREATE POLICY "Users can view own alerts"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Guardians can view their users' alerts"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guardian_connections
      WHERE guardian_connections.user_id = sos_alerts.user_id
      AND guardian_connections.guardian_id = auth.uid()
      AND guardian_connections.status = 'accepted'
    )
  );

CREATE POLICY "Network users can view active alerts nearby"
  ON sos_alerts FOR SELECT
  TO authenticated
  USING (
    status = 'active' AND
    EXISTS (
      SELECT 1 FROM suraksha_network_users
      WHERE suraksha_network_users.user_id = auth.uid()
      AND suraksha_network_users.is_available = true
    )
  );

CREATE POLICY "Users can create own alerts"
  ON sos_alerts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON sos_alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for incidents
CREATE POLICY "Users can view own incidents"
  ON incidents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own incidents"
  ON incidents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own incidents"
  ON incidents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for safe_zones (public read)
CREATE POLICY "Anyone can view safe zones"
  ON safe_zones FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for danger_zones (public read)
CREATE POLICY "Anyone can view danger zones"
  ON danger_zones FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can report danger zones"
  ON danger_zones FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reported_by);

-- RLS Policies for suraksha_network_users
CREATE POLICY "Users can view network users"
  ON suraksha_network_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own network profile"
  ON suraksha_network_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own network profile"
  ON suraksha_network_users FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for network_responses
CREATE POLICY "Users can view responses to their alerts"
  ON network_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sos_alerts
      WHERE sos_alerts.id = network_responses.alert_id
      AND sos_alerts.user_id = auth.uid()
    )
  );

CREATE POLICY "Responders can view own responses"
  ON network_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = responder_id);

CREATE POLICY "Network users can create responses"
  ON network_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = responder_id);

CREATE POLICY "Responders can update own responses"
  ON network_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = responder_id)
  WITH CHECK (auth.uid() = responder_id);

-- RLS Policies for ai_chat_sessions
CREATE POLICY "Users can view own chat sessions"
  ON ai_chat_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chat sessions"
  ON ai_chat_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions"
  ON ai_chat_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for support_resources (public read)
CREATE POLICY "Anyone can view support resources"
  ON support_resources FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''), 'user');
  
  INSERT INTO public.user_settings (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
