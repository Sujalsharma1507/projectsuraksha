# Project Suraksha - AI-Powered Women's Safety App

A next-generation mobile application designed to provide real-time protection, rapid response, and emotional assurance for women's safety.

## Features

### Authentication System
- **User Registration & Login**: Secure email/password authentication
- **Profile Management**: Complete user profile with personal details, emergency contacts, and blood group
- **Role-Based Access**: Support for users, guardians, and admin roles
- **Auto-Profile Creation**: Automatic profile and settings creation on signup

### Emergency SOS System
- **One-Tap SOS**: Instantly trigger emergency alerts
- **Multiple Trigger Methods**:
  - Manual button press
  - Voice activation
  - Motion detection (shake device)
- **Location Tracking**: Real-time GPS location sharing
- **Emergency Contact Alerts**: Automatic notification to saved contacts
- **Active Alert Management**: Cancel or update active alerts

### Safe & Danger Zones
- **Safe Zone Directory**:
  - Police stations
  - Hospitals
  - Verified cafes and public places
  - Safe houses
- **Danger Zone Alerts**:
  - Community-reported danger zones
  - Risk level indicators (low, medium, high, critical)
  - Incident count and recent activity
- **Navigation Assistance**: Quick route finding to safe locations

### AI Chat Assistant
- **24/7 Support**: Always-available AI assistant for guidance
- **Emotional Support**: Empathetic responses for distress situations
- **Safety Guidance**: Step-by-step safety instructions
- **Resource Connections**: Direct links to counseling and support services
- **Quick Response Options**: Pre-configured emergency phrases

### Suraksha Network
- **Community Protection**: Connect with nearby verified users
- **Real-Time Alerts**: Network members notified of nearby emergencies
- **Response Tracking**: Monitor who's responding to alerts
- **Rating System**: Community trust and reliability scores

### Support Resources
- **24/7 Hotlines**: National emergency helplines
- **Counseling Services**: Trauma and mental health support
- **NGO Directory**: Legal aid and empowerment organizations
- **Medical Support**: Specialized trauma care centers

### User Interface
- **Dark/Light Mode**: System-aware theme with manual toggle
- **Modern Design**: Clean, intuitive interface with smooth animations
- **Responsive Layout**: Optimized for all screen sizes
- **Accessibility**: High contrast ratios and readable fonts

## Technology Stack

### Frontend
- **React Native** with **Expo SDK 54**
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **Lucide React Native** for icons

### Backend
- **Supabase**
  - PostgreSQL database
  - Row Level Security (RLS)
  - Authentication
  - Real-time subscriptions

### Key Dependencies
- `@supabase/supabase-js` - Database client
- `expo-location` - GPS and location services
- `expo-camera` - Camera access for video recording
- `react-native-gesture-handler` - Touch interactions
- `react-native-reanimated` - Smooth animations

## Database Schema

### Core Tables
1. **profiles** - User information and preferences
2. **guardian_connections** - Guardian-user relationships
3. **emergency_contacts** - Personal emergency contacts
4. **sos_alerts** - Active and historical emergency alerts
5. **incidents** - Detailed incident reports
6. **safe_zones** - Verified safe locations
7. **danger_zones** - Community-reported danger areas
8. **suraksha_network_users** - Network member profiles
9. **network_responses** - Emergency response tracking
10. **ai_chat_sessions** - Chat history and sentiment analysis
11. **notifications** - User notifications
12. **support_resources** - Helplines, NGOs, and services
13. **user_settings** - User preferences and settings

## Project Structure

```
project/
├── app/
│   ├── (auth)/              # Authentication screens
│   │   ├── index.tsx        # Welcome screen
│   │   ├── login.tsx        # Login screen
│   │   └── signup.tsx       # Signup screen
│   ├── (tabs)/              # Main app tabs
│   │   ├── index.tsx        # Home dashboard
│   │   ├── sos.tsx          # Emergency SOS
│   │   ├── map.tsx          # Safe/danger zones map
│   │   ├── chat.tsx         # AI assistant
│   │   └── profile.tsx      # User profile
│   └── _layout.tsx          # Root layout
├── contexts/
│   ├── AuthContext.tsx      # Authentication state
│   └── ThemeContext.tsx     # Theme management
├── lib/
│   └── supabase.ts          # Supabase client
└── scripts/
    └── seed-data.sql        # Sample data for testing
```

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Guardians can view their assigned users' alerts
- Network users can see active nearby alerts
- Public read access for safe zones and resources

### Data Protection
- Secure authentication with Supabase
- Encrypted data transmission
- No sensitive data in client code
- Environment variables for API keys

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
The `.env` file contains your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

3. Seed sample data (optional):
Run the SQL in `scripts/seed-data.sql` in your Supabase SQL editor

4. Start development server:
```bash
npm run dev
```

### Building

Build for web:
```bash
npm run build:web
```

## Usage

### For Users
1. **Sign Up**: Create an account with email and password
2. **Complete Profile**: Add emergency contacts and personal details
3. **Enable Location**: Grant location permissions for emergency alerts
4. **Explore Safe Zones**: Find verified safe locations nearby
5. **Configure Settings**: Set up voice activation, shake detection, and notifications

### Emergency Situations
1. **Trigger SOS**: Press the red SOS button or shake device
2. **Automatic Actions**:
   - Location shared with emergency contacts
   - Nearby network users alerted
   - Audio/video recording starts (if enabled)
3. **Get Help**: Chat with AI assistant for guidance
4. **Cancel Alert**: Cancel when safe

### For Guardians
1. **Connect with Users**: Accept guardian requests
2. **Monitor Alerts**: Receive instant notifications
3. **View Locations**: Track user locations during emergencies
4. **Respond Quickly**: Access emergency contact information

## Future Enhancements

### Planned Features
- **Live Video Streaming**: Real-time video sharing during emergencies
- **Smart Watch Integration**: Trigger alerts from wearable devices
- **Offline Mode**: Core features available without internet
- **ML-Powered Detection**: Advanced AI for threat detection
- **Multi-Language Support**: Regional language options
- **Journey Tracking**: Share live location during travel
- **Community Forums**: Safe discussion spaces
- **Advanced Analytics**: Admin dashboard with insights

### AI Improvements
- Natural language processing for voice commands
- Sentiment analysis in chat
- Predictive danger zone mapping
- Personalized safety recommendations

## Contributing

This is a safety-critical application. Contributions should prioritize:
1. User privacy and data security
2. Reliability and performance
3. Accessibility for all users
4. Clear documentation

## Support

For help and support:
- Emergency: Contact local authorities (100/1091)
- Technical: Check documentation or create an issue
- Resources: See in-app support directory

## License

This project is developed for women's safety. Use responsibly and ethically.

---

**Remember**: Your safety is our priority. In real emergencies, always contact local authorities.
