# Krane Product HQ

Internal dashboard application for Krane team members with secure authentication.

## 🚀 Overview

Krane Product HQ is an internal web application built with Next.js 15 and Supabase, designed exclusively for Krane team members. It features email-based authentication restricted to `@krane.tech` domain addresses.

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Authentication**: Supabase Auth
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4
- **Runtime**: React 19.1.0

## ✨ Features

- ✅ Email-based authentication (password)
- ✅ Domain-restricted registration (`@krane.tech` only)
- ✅ Email confirmation flow
- ✅ Protected routes with middleware
- ✅ Server-side session management
- ✅ Secure sign-out functionality
- ✅ Responsive, modern UI

## 🔒 Security

- **Email Domain Restriction**: Only `@krane.tech` email addresses can register
- **Database-Level Validation**: PostgreSQL trigger prevents unauthorized signups
- **Client-Side Validation**: Additional validation layer in the UI
- **Protected Routes**: Middleware ensures authentication for dashboard access
- **Secure Session Management**: Server-side session handling with Supabase SSR

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **npm** or **yarn** package manager
- **Supabase account** with a project set up
- **@krane.tech email address** (for testing)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Noel-Krane/Krane-Product-HQ.git
cd Krane-Product-HQ
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Where to find these values:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**

### 4. Database Setup

The email domain validation trigger should already be applied. If not, run this SQL in your Supabase SQL Editor:

```sql
-- Function to validate email domain
CREATE OR REPLACE FUNCTION validate_krane_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email NOT LIKE '%@krane.tech' THEN
    RAISE EXCEPTION 'Only @krane.tech email addresses are allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER check_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION validate_krane_email();
```

### 5. Configure Supabase Authentication

In your Supabase Dashboard:

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure **Site URL** (for local dev: `http://localhost:3000`)
4. Configure **Redirect URLs**:
   - Add `http://localhost:3000/login` (for development)
   - Add your production URL when deploying

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
krane-product-hq/
├── app/
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── register/
│   │   └── page.tsx              # Registration page
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard (protected)
│   │   └── SignOutButton.tsx    # Sign out component
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home (redirects to login)
│   └── globals.css               # Global styles
├── lib/
│   └── supabase/
│       ├── client.ts             # Client-side Supabase client
│       └── server.ts             # Server-side Supabase client
├── middleware.ts                 # Route protection middleware
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Environment template
└── package.json                  # Dependencies
```

## 🔐 Authentication Flow

### Registration

1. User visits `/register`
2. Enters email (must be `@krane.tech`) and password
3. Client-side validation checks email domain
4. Supabase creates user account
5. Database trigger validates email domain (server-side)
6. Confirmation email sent to user
7. User clicks confirmation link in email
8. Account activated

### Login

1. User visits `/login`
2. Enters confirmed email and password
3. Supabase authenticates user
4. Session created
5. Redirected to `/dashboard`

### Protected Routes

- `/dashboard` and all sub-routes require authentication
- Middleware checks for valid session
- Unauthenticated users redirected to `/login`
- Authenticated users on `/login` or `/register` redirected to `/dashboard`

## 🧪 Testing

### Test Registration Flow

1. Try registering with `test@krane.tech` (should work)
2. Try registering with `test@gmail.com` (should fail with error)
3. Check email for confirmation link
4. Click confirmation link
5. Login with credentials

### Test Protected Routes

1. Visit `/dashboard` while logged out (should redirect to `/login`)
2. Login successfully
3. Visit `/dashboard` (should display dashboard)
4. Sign out (should redirect to `/login`)

## 🚀 Deployment

### Recommended: Vercel

1. Push your code to GitHub (already done!)
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy

### Update Supabase Settings

After deployment, update your Supabase project:

1. Go to **Authentication** → **URL Configuration**
2. Update **Site URL** to your production domain
3. Add production URL to **Redirect URLs**

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGc...` |

**⚠️ Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## 🛡️ Security Best Practices

- ✅ Environment variables not committed to Git
- ✅ Database-level email validation
- ✅ Server-side authentication checks
- ✅ Protected routes via middleware
- ✅ Secure session management with HTTP-only cookies
- ✅ Email confirmation required before login

## 🤝 Contributing

This is an internal project for Krane team members. If you need to contribute:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Internal use only - Krane Technologies

## 🆘 Support

For issues or questions, contact the Krane development team.

---

**Built with ❤️ by the Krane Team**