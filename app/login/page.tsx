'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';
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

  const handleTestUserLogin = async () => {
    setEmail('lihaoz0214@gmail.com');
    setPassword('Aa!717398');
    setLoading(true);
    setError('');

    const result = await signIn('lihaoz0214@gmail.com', 'Aa!717398');

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Test login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <LogIn className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <h2 className="text-2xl text-gray-700 mb-4">欢迎回来</h2>
          <p className="text-gray-600">Sign in to continue your assessment</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email / 邮箱
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password / 密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
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

        {/* Test User Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或 / Or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestUserLogin}
            disabled={loading}
            className={`mt-4 w-full border-2 border-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors ${
              loading
                ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-blue-400'
            }`}
          >
            Test User Login / 测试用户登录
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account? / 还没有账户?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Register / 注册
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to Home / 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
