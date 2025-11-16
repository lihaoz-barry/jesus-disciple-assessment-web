'use client';

import Link from 'next/link';
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react';

export default function ProfilePage() {
  // Sample user data - in production, this would come from Supabase
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2025-01-15',
    assessmentsCompleted: 1,
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard / 返回控制面板</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Profile
            </h1>
            <h2 className="text-2xl text-gray-700 mb-4">
              个人资料
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">Disciple in Training / 正在成长的门徒</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Email / 邮箱</h4>
                </div>
                <p className="text-gray-700">{user.email}</p>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Member Since / 加入时间</h4>
                </div>
                <p className="text-gray-700">
                  {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold">Assessments / 评估次数</h4>
                </div>
                <p className="text-gray-700">{user.assessmentsCompleted} completed</p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Account Settings / 账户设置</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password / 修改密码
                </button>
                <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Notification Settings / 通知设置
                </button>
                <button className="w-full text-left px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  Privacy Settings / 隐私设置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
