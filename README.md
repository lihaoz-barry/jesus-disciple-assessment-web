# Jesus Disciple Profile Assessment / 耶稣门徒生命自评量表

A comprehensive web application for assessing discipleship growth across 10 key areas of Christian life, covering both "Being" (生命状态) and "Doing" (行为行动) dimensions.

## Features / 功能特点

- **Bilingual Support**: English and Chinese (双语支持:英文和中文)
- **User Authentication**: Login and registration (用户认证:登录和注册)
- **Comprehensive Assessment**: 50 questions across 10 spiritual areas (全面评估:涵盖10个属灵领域的50个问题)
- **Visual Results**: Interactive charts and graphs (可视化结果:互动图表和图形)
- **Responsive Design**: Works on desktop and mobile (响应式设计:适用于桌面和移动设备)

## Tech Stack / 技术栈

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

## Getting Started / 快速开始

### Prerequisites / 前置要求

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for database)
- Vercel account (for deployment)

### Installation / 安装

1. **Clone the repository / 克隆仓库**
   ```bash
   git clone <your-repo-url>
   cd jesus-disciple-assessment-web
   ```

2. **Install dependencies / 安装依赖**
   ```bash
   npm install
   ```

3. **Set up environment variables / 设置环境变量**

   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database / 设置Supabase数据库**

   - Create a new project at [supabase.com](https://supabase.com)
   - Go to SQL Editor and run the schema in `supabase/schema.sql`
   - This will create the necessary tables and security policies

5. **Run development server / 运行开发服务器**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure / 项目结构

```
jesus-disciple-assessment-web/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Home page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # User dashboard
│   ├── assessment/          # Assessment questionnaire
│   ├── results/             # Results with charts
│   ├── profile/             # User profile
│   └── globals.css          # Global styles
├── data/                     # Assessment data
│   └── jesus-disciple-assess.json  # Questions & structure
├── lib/                      # Utility libraries
│   └── supabase.ts          # Supabase client
├── supabase/                 # Database schema
│   └── schema.sql           # SQL schema for tables
├── public/                   # Static assets
└── package.json             # Dependencies
```

## Deploying to Vercel / 部署到Vercel

### Quick Deploy / 快速部署

1. **Push to GitHub / 推送到GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel / 部署到Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Access your site / 访问您的网站**

   Vercel will provide a URL like `https://your-project.vercel.app`

### Manual Deploy / 手动部署

Alternatively, use Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Assessment Areas / 评估领域

### Being Behaviors / 生命状态行为
1. **Identity** / 身份 - Grounded in God's grace
2. **Holiness** / 圣洁 - Christian character
3. **Habit** / 习惯 - Rhythm of intimacy with Christ
4. **Posture** / 姿态 - Faithfulness & humility
5. **Calling** / 呼召 - God's dynamic call

### Doing Behaviors / 行为行动行为
6. **Witness** / 见证 - Sharing Good News
7. **Stewarding** / 管家职分 - Gifts & capabilities
8. **Role** / 角色 - Unique contribution
9. **Community** / 群体 - Authenticity in faith community
10. **Empowering** / 成全 - Helping others grow

## Database Schema / 数据库架构

The Supabase database includes:

- **profiles**: User information
- **assessment_results**: Stores completed assessments
- Row Level Security (RLS) policies for data protection
- Automatic profile creation on user signup

See `supabase/schema.sql` for details.

## Development Roadmap / 开发路线图

- [x] Basic UI framework
- [x] Assessment questionnaire
- [x] Results visualization
- [ ] Supabase integration (authentication)
- [ ] Save assessment results to database
- [ ] Historical comparison charts
- [ ] PDF export functionality
- [ ] Mentor/sharing features

## Contributing / 贡献

Contributions are welcome! Please feel free to submit a Pull Request.

## License / 许可证

This project is for church ministry use.

## Support / 支持

For questions or issues, please contact your church administrator.

---

**Built with** ❤️ **for the Kingdom of God** / **为神的国度而建**
