'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, TrendingUp, X } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import assessmentData from '@/data/jesus-disciple-assess.json';
import { useAuth } from '@/contexts/AuthContext';
import { getAssessmentHistory, AssessmentResult } from '@/lib/database';

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadHistory();
  }, [user, router]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const history = await getAssessmentHistory(user.id);
      setAssessments(history);
    } catch (error) {
      console.error('Failed to load assessment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(selectedForComparison.filter(sid => sid !== id));
    } else if (selectedForComparison.length < 2) {
      setSelectedForComparison([...selectedForComparison, id]);
    }
  };

  const getRadarData = (assessment: AssessmentResult) => {
    return assessmentData.sections.map((section) => {
      const score = assessment.scores?.[section.id] || 0;
      return {
        area: section.title_en.split(':')[0].trim(),
        score: Number(score.toFixed(1)),
      };
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading history... / 加载历史记录中...</p>
        </div>
      </div>
    );
  }

  // Comparison view
  if (compareMode && selectedForComparison.length === 2) {
    const assessment1 = assessments.find(a => a.id === selectedForComparison[0]);
    const assessment2 = assessments.find(a => a.id === selectedForComparison[1]);

    if (!assessment1 || !assessment2) {
      setCompareMode(false);
      return null;
    }

    const radarData1 = getRadarData(assessment1);
    const radarData2 = getRadarData(assessment2);

    // Combine data for dual radar chart
    const combinedRadarData = radarData1.map((item, index) => ({
      area: item.area,
      score1: item.score,
      score2: radarData2[index].score,
    }));

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Assessment Comparison
                </h1>
                <h2 className="text-2xl text-gray-700">评估对比</h2>
              </div>
              <button
                onClick={() => setCompareMode(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Close Comparison / 关闭对比
              </button>
            </div>

            {/* Comparison Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-1">Assessment 1 / 评估 1</p>
                <p className="text-sm text-blue-700">{formatDate(assessment1.completed_at)}</p>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-lg">
                <p className="font-semibold text-amber-900 mb-1">Assessment 2 / 评估 2</p>
                <p className="text-sm text-amber-700">{formatDate(assessment2.completed_at)}</p>
              </div>
            </div>

            {/* Comparison Radar Chart */}
            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <h3 className="text-2xl font-bold mb-4 text-center">Comparison Chart / 对比图表</h3>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={combinedRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar
                    name={`${formatDate(assessment1.completed_at)}`}
                    dataKey="score1"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.5}
                  />
                  <Radar
                    name={`${formatDate(assessment2.completed_at)}`}
                    dataKey="score2"
                    stroke="#d97706"
                    fill="#f59e0b"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Detailed Score Comparison */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Score Changes / 分数变化</h3>
              <div className="space-y-3">
                {assessmentData.sections.map((section) => {
                  const score1 = assessment1.scores?.[section.id] || 0;
                  const score2 = assessment2.scores?.[section.id] || 0;
                  const diff = score2 - score1;
                  const diffPercent = score1 > 0 ? ((diff / score1) * 100).toFixed(1) : '0';

                  return (
                    <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{section.title_en.split(':')[0].trim()}</h4>
                          <p className="text-sm text-gray-600">{section.title_zh.split(':')[0].trim()}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-4">
                            <span className="text-blue-600 font-semibold">{score1.toFixed(1)}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-amber-600 font-semibold">{score2.toFixed(1)}</span>
                            <span className={`text-sm font-medium ${diff > 0 ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)} ({diff > 0 ? '+' : ''}{diffPercent}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // History list view
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <Link href="/dashboard" className="text-amber-600 hover:text-amber-700 flex items-center gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard / 返回控制面板</span>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Assessment History
            </h1>
            <h2 className="text-2xl text-gray-700 mb-4">
              评估历史
            </h2>
            <p className="text-gray-600">
              {assessments.length} assessment{assessments.length !== 1 ? 's' : ''} completed /
              已完成 {assessments.length} 次评估
            </p>
          </div>

          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-600 mb-2">No assessments found</p>
              <p className="text-gray-500">未找到评估记录</p>
              <Link
                href="/assessment"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
              >
                Take Your First Assessment / 开始首次评估
              </Link>
            </div>
          ) : (
            <>
              {/* Comparison Mode Controls */}
              {selectedForComparison.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-amber-900">
                        {selectedForComparison.length} of 2 selected for comparison
                      </p>
                      <p className="text-sm text-amber-700">
                        已选择 {selectedForComparison.length} / 2 个评估进行对比
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {selectedForComparison.length === 2 && (
                        <button
                          onClick={() => setCompareMode(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Compare / 对比
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedForComparison([])}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                      >
                        Clear / 清除
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Assessment List */}
              <div className="space-y-4">
                {assessments.map((assessment, index) => {
                  const isSelected = selectedForComparison.includes(assessment.id);
                  const overallAvg = assessmentData.sections.reduce((sum, section) => {
                    return sum + (assessment.scores?.[section.id] || 0);
                  }, 0) / assessmentData.sections.length;

                  return (
                    <div
                      key={assessment.id}
                      className={`border-2 rounded-lg p-6 transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 bg-white hover:shadow-lg hover:border-amber-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-5 h-5 text-amber-600" />
                            <h3 className="text-xl font-bold text-gray-900">
                              {formatDate(assessment.completed_at)}
                            </h3>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                                Latest / 最新
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-6 mt-3">
                            <div>
                              <p className="text-sm text-gray-600">Overall Average</p>
                              <p className="text-2xl font-bold text-amber-600">{overallAvg.toFixed(1)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Questions Answered</p>
                              <p className="text-2xl font-bold text-gray-700">
                                {Object.keys(assessment.answers).length}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleSelection(assessment.id)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              isSelected
                                ? 'bg-amber-600 text-white hover:bg-amber-700'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                          >
                            {isSelected ? 'Selected / 已选' : 'Select / 选择'}
                          </button>
                          <button
                            onClick={() => {
                              // Store this specific assessment in sessionStorage and navigate to results
                              sessionStorage.setItem('assessmentResults', JSON.stringify({
                                answers: assessment.answers,
                                scores: assessment.scores || {},
                                completed_at: assessment.completed_at
                              }));
                              router.push('/results');
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                          >
                            View Details / 查看详情
                          </button>
                        </div>
                      </div>

                      {/* Mini radar preview */}
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <RadarChart data={getRadarData(assessment)}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="area" tick={{ fontSize: 10 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
                            <Radar
                              dataKey="score"
                              stroke="#d97706"
                              fill="#f59e0b"
                              fillOpacity={0.6}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
