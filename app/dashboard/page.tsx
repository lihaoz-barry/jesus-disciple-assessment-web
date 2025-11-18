'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, BarChart3, User, LogOut, Loader2, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserStats, UserStats } from '@/lib/database';

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    if (!user) return;

    const userStats = await getUserStats(user.id);
    setStats(userStats);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <h2 className="text-2xl text-gray-700">控制面板</h2>
            </div>
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading...</span>
                </div>
              ) : stats && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {stats.full_name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600">{stats.email}</p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout / 退出</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
            <p className="text-blue-800">
              <strong>Welcome{stats?.full_name ? `, ${stats.full_name}` : ''}!</strong> Start your discipleship assessment or view your previous results.
            </p>
            <p className="text-blue-700 text-sm mt-1">
              <strong>欢迎{stats?.full_name ? `，${stats.full_name}` : ''}!</strong> 开始您的门徒评估或查看之前的结果。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Assessment - Active */}
            <Link
              href="/assessment"
              className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-8 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <ClipboardList className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Take Assessment</h3>
              <p className="text-blue-100 mb-2">开始评估</p>
              <p className="text-sm text-blue-100">
                Complete the 50-question discipleship profile
              </p>
            </Link>

            {/* Results - Active */}
            <Link
              href="/results"
              className="bg-gradient-to-br from-green-500 to-green-700 text-white p-8 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <BarChart3 className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">View Results</h3>
              <p className="text-green-100 mb-2">查看结果</p>
              <p className="text-sm text-green-100">
                See your assessment results and charts
              </p>
            </Link>

            {/* History - Active */}
            <Link
              href="/history"
              className="bg-gradient-to-br from-amber-500 to-amber-700 text-white p-8 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <History className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">History</h3>
              <p className="text-amber-100 mb-2">历史记录</p>
              <p className="text-sm text-amber-100">
                View and compare past assessments
              </p>
            </Link>

            {/* Profile - Active */}
            <Link
              href="/profile"
              className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-8 rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <User className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Profile</h3>
              <p className="text-purple-100 mb-2">个人资料</p>
              <p className="text-sm text-purple-100">
                Manage your account settings
              </p>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Assessment Areas / 评估领域</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-lg mb-2">Being (生命状态)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Identity / 身份</li>
                <li>• Holiness / 圣洁</li>
                <li>• Habit / 习惯</li>
                <li>• Posture / 姿态</li>
                <li>• Calling / 呼召</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-lg mb-2">Doing (行为行动)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Witness / 见证</li>
                <li>• Stewarding / 管家职分</li>
                <li>• Role / 角色</li>
                <li>• Community / 群体</li>
                <li>• Empowering / 成全</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
