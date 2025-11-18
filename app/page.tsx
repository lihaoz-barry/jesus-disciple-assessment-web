import Link from 'next/link';
import { BookOpen, User, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            Jesus Disciple Profile Assessment
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl text-gray-700 mb-3 sm:mb-4 md:mb-6">
            耶稣门徒生命自评量表
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600">
            Discover your spiritual growth journey through a comprehensive self-assessment
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <div className="bg-blue-50 p-3 sm:p-4 md:p-6 rounded-xl text-center">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 text-blue-600" />
            <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">10 Areas</h3>
            <p className="text-xs sm:text-sm text-gray-600">Being & Doing dimensions</p>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 md:p-6 rounded-xl text-center">
            <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 text-green-600" />
            <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">50 Questions</h3>
            <p className="text-xs sm:text-sm text-gray-600">Comprehensive evaluation</p>
          </div>
          <div className="bg-purple-50 p-3 sm:p-4 md:p-6 rounded-xl text-center">
            <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 sm:mb-3 md:mb-4 text-purple-600" />
            <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">Visual Results</h3>
            <p className="text-xs sm:text-sm text-gray-600">Interactive charts & insights</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 rounded-lg text-center transition-colors text-sm sm:text-base"
          >
            Login / 登录
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-2.5 sm:py-3 md:py-4 px-6 sm:px-8 rounded-lg border-2 border-blue-600 text-center transition-colors text-sm sm:text-base"
          >
            Register / 注册
          </Link>
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-12 text-center text-xs sm:text-sm text-gray-500">
          <p>Powered by Next.js, Supabase & Vercel</p>
        </div>
      </div>
    </div>
  );
}
