# Setup Guide - 设置指南

## Environment Variables - 环境变量设置

This project uses Supabase for authentication. You need to configure the following environment variables:

本项目使用 Supabase 进行认证。您需要配置以下环境变量：

### Required Variables - 必需的变量

For the application to work, you only need these two environment variables:

应用程序运行只需要这两个环境变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Setup Steps - 设置步骤

1. **Copy the environment file - 复制环境文件**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in the values - 填入值**

   Open `.env.local` and add your Supabase credentials from Vercel:

   打开 `.env.local` 并添加您在 Vercel 中配置的 Supabase 凭证：

   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

3. **Install dependencies - 安装依赖**
   ```bash
   npm install
   ```

4. **Run the development server - 运行开发服务器**
   ```bash
   npm run dev
   ```

5. **Open the app - 打开应用**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Vercel Deployment - Vercel 部署

Your environment variables are already configured in Vercel across all environments:
- Production
- Preview (staging branch)
- Development

您的环境变量已在 Vercel 的所有环境中配置：
- Production（生产环境）
- Preview（staging 分支）
- Development（开发环境）

The application will automatically use these variables when deployed.

部署时，应用程序将自动使用这些变量。

## Authentication Features - 认证功能

The following authentication features are now implemented:

以下认证功能现已实现：

- ✅ Email registration - 邮箱注册
- ✅ Email login - 邮箱登录
- ✅ Protected routes (dashboard, assessment) - 受保护的路由
- ✅ Auto-redirect for authenticated users - 已登录用户自动重定向
- ✅ Session management - 会话管理
- ✅ Sign out - 登出

## Testing - 测试

To test the authentication:

测试认证功能：

1. Go to `/register` to create a new account
   访问 `/register` 创建新账户

2. Use your email and a password (minimum 6 characters)
   使用您的邮箱和密码（至少 6 个字符）

3. After successful registration, you'll be redirected to login
   注册成功后，将重定向到登录页面

4. Login with your credentials
   使用您的凭证登录

5. You'll be redirected to the dashboard
   将重定向到仪表板

## Troubleshooting - 故障排除

### Issue: "Invalid API key" or "Invalid URL"

Make sure your `.env.local` file has the correct values from your Vercel environment variables.

确保您的 `.env.local` 文件包含来自 Vercel 环境变量的正确值。

### Issue: Authentication not working

1. Check that your Supabase project is active
   检查您的 Supabase 项目是否处于活动状态

2. Verify that email authentication is enabled in Supabase
   验证 Supabase 中是否启用了邮箱认证

3. Check browser console for any errors
   检查浏览器控制台是否有任何错误
