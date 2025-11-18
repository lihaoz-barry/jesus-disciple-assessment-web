'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import assessmentData from '@/data/jesus-disciple-assess.json';
import { useAuth } from '@/contexts/AuthContext';
import { getLatestAssessment } from '@/lib/database';

interface AssessmentResults {
  answers: Record<string, number>;
  scores: Record<string, number>;
  completed_at: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      // First, try to load from sessionStorage (just submitted)
      const storedResults = sessionStorage.getItem('assessmentResults');

      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults);
          setResults(parsedResults);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Failed to parse sessionStorage results:', error);
        }
      }

      // If no sessionStorage, try to load latest from database
      if (user) {
        try {
          const latestAssessment = await getLatestAssessment(user.id);
          if (latestAssessment) {
            setResults({
              answers: latestAssessment.answers,
              scores: latestAssessment.scores || {},
              completed_at: latestAssessment.completed_at
            });
          }
        } catch (error) {
          console.error('Failed to load from database:', error);
        }
      }

      setLoading(false);
    }

    loadResults();
  }, [user]);

  // If no results, redirect to assessment
  useEffect(() => {
    if (!loading && !results) {
      router.push('/assessment');
    }
  }, [loading, results, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading results... / 加载结果中...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return null; // Will redirect
  }

  // Map section IDs to display data
  const sectionResults = assessmentData.sections.map((section) => {
    const score = results.scores[section.id] || 0;
    return {
      id: section.id,
      name: section.title_en.split(':')[0].trim(),
      nameChinese: section.title_zh.split(':')[0].trim(),
      fullName_en: section.title_en,
      fullName_zh: section.title_zh,
      score: score,
      maxScore: 5,
      groupId: section.group_id
    };
  });

  const beingScores = sectionResults.filter(s => s.groupId === 'being');
  const doingScores = sectionResults.filter(s => s.groupId === 'doing');

  const overallAverage = (
    sectionResults.reduce((sum, item) => sum + item.score, 0) / sectionResults.length
  ).toFixed(1);

  const beingAverage = beingScores.length > 0
    ? (beingScores.reduce((sum, item) => sum + item.score, 0) / beingScores.length).toFixed(1)
    : '0.0';

  const doingAverage = doingScores.length > 0
    ? (doingScores.reduce((sum, item) => sum + item.score, 0) / doingScores.length).toFixed(1)
    : '0.0';

  const radarData = sectionResults.map(item => ({
    area: item.name,
    score: Number(item.score.toFixed(1)),
  }));

  const completedDate = new Date(results.completed_at).toLocaleDateString();
  const totalQuestions = Object.keys(results.answers).length;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard / 返回控制面板</span>
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Assessment Results
                </h1>
                <h2 className="text-2xl text-gray-700 mb-4">
                  评估结果
                </h2>
                <p className="text-gray-600">
                  Completed on: {completedDate} / 完成时间
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {totalQuestions} questions answered / 已回答 {totalQuestions} 题
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Print / 打印
              </button>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Overall Average</h3>
              <p className="text-sm mb-2">总体平均分</p>
              <p className="text-4xl font-bold">{overallAverage}</p>
              <p className="text-sm mt-2">out of 5.0</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Being Average</h3>
              <p className="text-sm mb-2">生命状态平均分</p>
              <p className="text-4xl font-bold">{beingAverage}</p>
              <p className="text-sm mt-2">out of 5.0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-2">Doing Average</h3>
              <p className="text-sm mb-2">行为行动平均分</p>
              <p className="text-4xl font-bold">{doingAverage}</p>
              <p className="text-sm mt-2">out of 5.0</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">About this assessment / 关于此评估</p>
              <p>Questions were presented in random order. Scores are calculated based on the 10 spiritual growth categories below.</p>
              <p className="mt-1">题目以随机顺序呈现。分数根据以下10个属灵成长类别计算。</p>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Overall Profile / 整体概况</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="area" />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} />
                  <Radar
                    name="Your Score"
                    dataKey="score"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Being */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Being Behaviors / 生命状态行为</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={beingScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart - Doing */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Doing Behaviors / 行为行动行为</h3>
            <div className="bg-gray-50 p-6 rounded-xl">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={doingScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#10b981" name="Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Scores */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Detailed Scores / 详细分数</h3>
            <div className="space-y-4">
              {sectionResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{result.name}</h4>
                      <p className="text-sm text-gray-600">{result.nameChinese}</p>
                      <p className="text-xs text-gray-500 mt-1">{result.fullName_en}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        {result.score.toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-500">/ 5.0</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(result.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Next Steps / 下一步</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Review areas with lower scores and consider growth opportunities</li>
              <li>查看得分较低的领域,思考成长机会</li>
              <li>Discuss results with a mentor or spiritual director</li>
              <li>与导师或属灵导师讨论结果</li>
              <li>Retake the assessment in 3-6 months to track progress</li>
              <li>3-6个月后重新评估以追踪进展</li>
            </ul>
          </div>

          {/* Retake Button */}
          <div className="mt-8 text-center">
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              onClick={() => sessionStorage.removeItem('assessmentResults')}
            >
              Take Assessment Again / 重新评估
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
