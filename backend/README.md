# Clari Backend Setup Guide

This backend integration uses Supabase for authentication, database, and real-time features. Follow these steps to get the backend running.

## 🚀 Quick Start

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in/up
2. Click "New project"
3. Fill in your project details:
   - **Project Name**: clari-meeting-assistant
   - **Database Password**: Choose a secure password
   - **Region**: Choose closest to your users
4. Wait for the project to be created (1-2 minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:

   ```bash
   # Copy .env.example to .env
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `backend/schemas/database.sql`
3. Paste and run the SQL script
4. Verify tables were created in **Table Editor**

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure **Site URL** to `http://localhost:5173` (for development)
4. Add production URL when deploying

### 6. Test the Integration

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. Try to access protected routes (Features, Demo, Integrations, Chatbot)
4. You should be redirected to login page
5. Create an account and verify authentication works

## 📁 Backend Structure

```
backend/
├── config/
│   └── supabase.ts          # Supabase client and type definitions
├── auth/
│   ├── authService.ts       # Authentication service layer
│   ├── AuthContext.tsx      # React context for auth state
│   └── ProtectedRoute.tsx   # Route protection component
├── services/
│   └── meetingService.ts    # Meeting data management
└── schemas/
    └── database.sql         # Complete database schema
```

## 🔐 Authentication Features

- ✅ **Email/Password Authentication**
- ✅ **Protected Routes** - Features require login
- ✅ **Auto Profile Creation** - Profile created on signup
- ✅ **Session Management** - Persistent login state
- ✅ **Route Protection** - Automatic redirect to login
- ✅ **User Context** - Access user data throughout app

## 🗄️ Database Schema

### Tables Created:

- **profiles** - User profile data (extends auth.users)
- **meetings** - Meeting records with title, description, timing
- **transcripts** - Real-time meeting transcriptions
- **action_items** - AI-extracted tasks and assignments

### Security Features:

- **Row Level Security (RLS)** - Users can only access their own data
- **Auto Profile Creation** - Trigger creates profile on user signup
- **Data Validation** - Constraints and checks on important fields

## 🛡️ Security Configuration

The backend implements several security best practices:

1. **Row Level Security**: Every table has RLS policies
2. **Authentication Required**: All protected routes check auth state
3. **User Isolation**: Users can only access their own meetings/data
4. **Input Validation**: Form validation on client and database level
5. **Secure Tokens**: Supabase handles JWT token management

## 🚦 Route Protection

The following routes are protected and require authentication:

- `/features` - Feature overview page
- `/demo` - Live demo functionality
- `/integrations` - Integration management
- `/chatbot` - AI chatbot interface

Public routes (no auth required):

- `/` - Home page
- `/contact` - Contact information
- `/login` - Authentication
- `/signup` - Registration

## 🔧 Development Notes

### Environment Variables

- Prefix client-side variables with `VITE_`
- Never commit `.env` to version control
- Use `.env.example` for template

### Type Safety

- Database types are defined in `backend/config/supabase.ts`
- Services return consistent `{ data, error }` patterns
- React hooks provide typed auth context

### Error Handling

- All services include comprehensive error handling
- User-friendly error messages in UI
- Console logging for debugging

## 🚀 Deployment

When deploying to production:

1. **Update Supabase Settings**:

   - Add production URL to **Site URL**
   - Configure **Redirect URLs**
   - Update **CORS** settings if needed

2. **Environment Variables**:

   - Set production Supabase credentials
   - Use same variable names as development

3. **Database**:
   - Run the schema SQL in production Supabase
   - Verify RLS policies are active

## ❗ Important Notes

1. **Never commit `.env`** - Contains sensitive credentials
2. **Test authentication flow** before deploying
3. **Verify RLS policies** are working correctly
4. **Users must authenticate** to access core features
5. **Email verification** may be required (configurable in Supabase)

## 🤝 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Supabase credentials are correct
3. Ensure database schema was applied correctly
4. Check Supabase Auth logs in dashboard
