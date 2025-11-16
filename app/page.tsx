import Link from 'next/link';
import { BookOpen, User, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Jesus Disciple Profile Assessment
          </h1>
          <h2 className="text-3xl text-gray-700 mb-6">
            耶稣门徒生命自评量表
          </h2>
          <p className="text-lg text-gray-600">
            Discover your spiritual growth journey through a comprehensive self-assessment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg mb-2">10 Areas</h3>
            <p className="text-sm text-gray-600">Being & Doing dimensions</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl text-center">
            <User className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="font-semibold text-lg mb-2">50 Questions</h3>
            <p className="text-sm text-gray-600">Comprehensive evaluation</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-purple-600" />
            <h3 className="font-semibold text-lg mb-2">Visual Results</h3>
            <p className="text-sm text-gray-600">Interactive charts & insights</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-center transition-colors"
          >
            Login / 登录
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-lg border-2 border-blue-600 text-center transition-colors"
          >
            Register / 注册
          </Link>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by Next.js, Supabase & Vercel</p>
        </div>
      </div>
    </div>
  );
}
