# Supabase Configuration Guide

This application uses Supabase for authentication. To fully configure authentication, follow these steps:

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or sign in to your account
3. Create a new project
4. Wait for the project to be set up

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings > API**
2. Copy your **Project URL** and **anon public** key

## 3. Configure Environment Variables

Update the `.env` file in your project root with your real credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_real_anon_key_here
```

**Important:** Replace `your-real-anon-key-here` in the `.env` file with your actual anon key from Supabase.

## 4. Configure OAuth Providers (Optional)

To enable Google and GitHub sign-in:

### Google OAuth
1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable Google provider
3. Add your Google OAuth credentials

### GitHub OAuth
1. Go to **Authentication > Providers** in your Supabase dashboard
2. Enable GitHub provider
3. Add your GitHub OAuth credentials

## 5. Configure Site URL

1. In your Supabase dashboard, go to **Authentication > URL Configuration**
2. Add your site URL (e.g., `http://localhost:5173` for development)

## Current Features

- ✅ Email/Password authentication
- ✅ Google OAuth (when configured)
- ✅ GitHub OAuth (when configured)
- ✅ User session management
- ✅ Automatic token refresh
- ✅ User profile display
- ✅ Sign out functionality

## Demo Mode

The app will work in demo mode with placeholder credentials, but real authentication requires proper Supabase configuration.

## Troubleshooting

If you see authentication errors:
1. Verify your Supabase URL and anon key are correct
2. Check that your site URL is configured in Supabase
3. Ensure the `.env` file is properly formatted
4. Restart your development server after updating environment variables