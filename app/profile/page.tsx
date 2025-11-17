'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Calendar, Edit2, Save, X, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserStats, UserStats, updateUserProfile } from '@/lib/database';

export default function ProfilePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    const userStats = await getUserStats(user.id);
    setStats(userStats);
    setNewName(userStats?.full_name || '');
    setLoading(false);
  };

  const handleSaveName = async () => {
    if (!user || !newName.trim()) return;

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    const result = await updateUserProfile(user.id, { full_name: newName.trim() });

    if (result.success) {
      setSaveSuccess(true);
      setEditingName(false);
      // Reload stats to get updated data
      await loadUserData();
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(result.error || 'Failed to update name');
    }

    setSaving(false);
  };

  const handleCancelEdit = () => {
    setNewName(stats?.full_name || '');
    setEditingName(false);
    setSaveError('');
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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

          {saveSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Profile updated successfully! / 资料更新成功！</span>
            </div>
          )}

          <div className="space-y-6">
            {/* User Name Card with Edit */}
            <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-xl">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {(stats.full_name || stats.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                {!editingName ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {stats.full_name || stats.email}
                    </h3>
                    <p className="text-gray-600">Disciple in Training / 正在成长的门徒</p>
                  </>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter your name / 输入您的姓名"
                      disabled={saving}
                    />
                    {saveError && (
                      <p className="text-sm text-red-600">{saveError}</p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {!editingName ? (
                  <button
                    onClick={() => setEditingName(true)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit name / 编辑姓名"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveName}
                      disabled={saving || !newName.trim()}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Save / 保存"
                    >
                      {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="Cancel / 取消"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* User Information Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Email / 邮箱</h4>
                </div>
                <p className="text-gray-700">{stats.email}</p>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed / 不可更改</p>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Member Since / 加入时间</h4>
                </div>
                <p className="text-gray-700">
                  {new Date(stats.member_since).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl bg-white">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Assessments / 评估次数</h4>
                </div>
                <p className="text-gray-700">
                  {stats.assessment_count} {stats.assessment_count === 1 ? 'time' : 'times'} completed
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.assessment_count === 0 ? 'Start your first assessment! / 开始您的第一次评估！' : ''}
                </p>
              </div>

              {stats.last_assessment && (
                <div className="p-6 border border-gray-200 rounded-xl bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Last Assessment / 最近评估</h4>
                  </div>
                  <p className="text-gray-700">
                    {new Date(stats.last_assessment).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Account Settings - Grayed out */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-500">Account Settings / 账户设置</h3>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-semibold">
                  Coming Soon
                </span>
              </div>
              <div className="space-y-3 opacity-50">
                <div className="w-full text-left px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed">
                  Change Password / 修改密码
                </div>
                <div className="w-full text-left px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed">
                  Notification Settings / 通知设置
                </div>
                <div className="w-full text-left px-4 py-3 bg-gray-200 border border-gray-300 rounded-lg cursor-not-allowed">
                  Privacy Settings / 隐私设置
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 italic">
                These features are under development / 这些功能正在开发中
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
