'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleTestLogin = async () => {
    setLoading(true);
    setError('');

    const result = await signIn('test@abc.com', 'test12345');

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Test login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <LogIn className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mx-auto mb-2 sm:mb-3 md:mb-4 text-blue-600" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Welcome Back</h1>
          <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-2 sm:mb-3 md:mb-4">欢迎回来</h2>
          <p className="text-sm sm:text-base text-gray-600">Sign in to continue your assessment</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Email / 邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Password / 密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm sm:text-base"
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Signing in... / 登录中...</span>
              </>
            ) : (
              <span>Sign In / 登录</span>
            )}
          </button>
        </form>

        <div className="mt-4 sm:mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-white text-gray-500">Demo / 演示</span>
            </div>
          </div>

          <button
            onClick={handleTestLogin}
            disabled={loading}
            className="mt-3 sm:mt-4 w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span>Logging in... / 登录中...</span>
              </>
            ) : (
              <span>🎭 Demo Login / 演示登录</span>
            )}
          </button>
          <p className="mt-1.5 sm:mt-2 text-xs text-center text-gray-500">
            For customer preview only / 仅供客户预览
          </p>
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Don&apos;t have an account? / 还没有账户?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Register / 注册
            </Link>
          </p>
        </div>

        <div className="mt-3 sm:mt-4 text-center">
          <Link href="/" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home / 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
