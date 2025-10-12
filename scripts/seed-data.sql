-- Sample data for Project Suraksha
-- This file contains seed data for safe zones and support resources

-- Insert sample safe zones
INSERT INTO safe_zones (name, type, latitude, longitude, address, phone, rating, is_verified, operating_hours)
VALUES
  ('City Police Station', 'police_station', 28.6139, 77.2090, 'Connaught Place, New Delhi', '+91-11-23456789', 4.5, true, '{"open": "24/7"}'),
  ('Fortis Hospital', 'hospital', 28.5672, 77.1915, 'Vasant Kunj, New Delhi', '+91-11-42424242', 4.7, true, '{"open": "24/7"}'),
  ('Cafe Coffee Day - Safe Spot', 'cafe', 28.5494, 77.2001, 'Saket, New Delhi', '+91-11-26542345', 4.2, true, '{"open": "8AM-11PM"}'),
  ('Women Safety House', 'safe_house', 28.6328, 77.2197, 'Kashmiri Gate, New Delhi', '+91-11-23567890', 4.8, true, '{"open": "24/7"}'),
  ('Apollo Hospital Emergency', 'hospital', 28.5432, 77.1876, 'Press Enclave Road, New Delhi', '+91-11-29876543', 4.6, true, '{"open": "24/7"}'),
  ('Central Park Community Center', 'public_place', 28.5677, 77.1988, 'Sector 18, New Delhi', '+91-11-23345678', 4.3, true, '{"open": "6AM-10PM"}');

-- Insert sample danger zones
INSERT INTO danger_zones (latitude, longitude, radius, danger_level, description, incident_count, last_incident_at)
VALUES
  (28.5355, 77.1766, 200, 'high', 'Poorly lit area with low police presence. Multiple harassment cases reported.', 15, now() - interval '3 days'),
  (28.6012, 77.2234, 150, 'medium', 'Isolated area during night hours. Exercise caution after 8 PM.', 8, now() - interval '10 days'),
  (28.5789, 77.2456, 300, 'critical', 'High crime area. Avoid during night hours. Multiple assault reports.', 27, now() - interval '1 day'),
  (28.5543, 77.1899, 100, 'low', 'Occasional incidents during late night. Generally safe during day.', 3, now() - interval '30 days');

-- Insert sample support resources
INSERT INTO support_resources (category, name, description, contact_phone, contact_email, website_url, is_24x7)
VALUES
  ('hotline', 'National Women Helpline', '24/7 emergency helpline for women in distress', '1091', 'help@women-helpline.gov.in', 'https://wcd.nic.in', true),
  ('hotline', 'Police Emergency', 'Emergency police assistance', '100', 'emergency@police.gov.in', 'https://police.gov.in', true),
  ('counselor', 'Vandana Sharma - Trauma Counselor', 'Specialized in trauma and crisis counseling for women', '+91-98765-43210', 'vandana.sharma@counseling.in', 'https://counseling.in', false),
  ('ngo', 'Women Safety Foundation', 'NGO providing legal aid and support to women', '+91-11-23456780', 'contact@wsf.org', 'https://wsf.org', false),
  ('legal_aid', 'Free Legal Aid Center', 'Free legal assistance for women', '+91-11-23456781', 'legal@flac.org', 'https://flac.org', false),
  ('medical', 'Trauma Care Center', 'Specialized medical care for assault victims', '+91-11-23456782', 'care@trauma-center.in', 'https://trauma-center.in', true),
  ('counselor', 'Dr. Priya Mehta - Clinical Psychologist', 'Mental health support and therapy', '+91-98765-43211', 'priya.mehta@therapy.in', 'https://therapy.in', false),
  ('ngo', 'Shakti Foundation', 'Empowerment and rehabilitation programs for women', '+91-11-23456783', 'info@shakti.org', 'https://shakti.org', false);
