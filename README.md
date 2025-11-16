# Jesus Disciple Assessment Web

Austin Chinese Church Jesus Disciple Assessment Website

A Next.js 14 + TypeScript application with Supabase authentication for evaluating spiritual growth and discipleship journey.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Supabase Authentication (email + password)
- ✅ Protected routes with middleware
- ✅ Authentication pages (/auth/register, /auth/login)
- ✅ Protected dashboard
- ✅ Assessment page with 1-5 Likert scale
- ✅ Bilingual support (English/中文)
- ✅ Tailwind CSS for styling
- ✅ Vercel-ready deployment

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for production use)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lihaoz-barry/jesus-disciple-assessment-web.git
cd jesus-disciple-assessment-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/         # Login page
│   │   │   └── register/      # Registration page
│   │   ├── dashboard/         # Protected dashboard
│   │   ├── assessment/        # Assessment page with Likert form
│   │   └── page.tsx           # Home page
│   ├── utils/
│   │   └── supabase/          # Supabase client utilities
│   └── middleware.ts          # Auth middleware for protected routes
├── data/
│   └── jesus-disciple-profile.en-zh.json  # Assessment questions
└── public/
    └── data/                  # Publicly accessible data files
```

## Deployment

This application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Supabase Setup

To use authentication, you need to:

1. Create a project on [Supabase](https://supabase.com)
2. Enable Email/Password authentication in Authentication settings
3. Copy your project URL and anon key to `.env.local`

## License

This project is for Austin Chinese Church.
