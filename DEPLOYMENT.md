# Deployment Guide

## Vercel Deployment

This application is optimized for Vercel deployment.

### Steps to Deploy

1. **Push to GitHub**
   - Ensure all changes are committed and pushed to your GitHub repository

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   
   Add the following environment variables in Vercel's dashboard:
   
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll receive a production URL

### Supabase Setup

Before deploying, set up your Supabase project:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the database to initialize

2. **Enable Email Authentication**
   - Go to Authentication > Providers
   - Enable Email provider
   - Configure email settings (or use default)

3. **Get API Credentials**
   - Go to Settings > API
   - Copy your Project URL
   - Copy your anon/public key

4. **Configure Authentication Settings**
   - Go to Authentication > URL Configuration
   - Add your Vercel domain as a Site URL
   - Add redirect URLs if needed

### Post-Deployment

After deployment:

1. Test user registration at `/auth/register`
2. Test user login at `/auth/login`
3. Verify protected routes redirect to login
4. Test the assessment page at `/assessment`

### Troubleshooting

**Issue: Authentication not working**
- Verify environment variables are set correctly in Vercel
- Check Supabase Site URL configuration
- Ensure email authentication is enabled in Supabase

**Issue: Middleware redirects not working**
- Check that middleware.ts is properly deployed
- Verify the matcher configuration in middleware

**Issue: Data file not loading**
- Ensure public/data/jesus-disciple-profile.en-zh.json exists
- Check browser console for CORS errors

### Custom Domain

To add a custom domain:

1. Go to Project Settings > Domains in Vercel
2. Add your domain
3. Configure DNS records as instructed
4. Update Supabase Site URL with new domain

## Alternative Deployment Options

### Docker Deployment

```bash
# Build
npm run build

# Create Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]

# Build and run
docker build -t jesus-disciple-assessment .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=your-url -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key jesus-disciple-assessment
```

### Traditional Node.js Hosting

```bash
# Install dependencies
npm ci

# Build
npm run build

# Start
npm start
```

Make sure to set environment variables on your hosting platform.
