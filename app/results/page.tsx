'use client';

import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import assessmentData from '@/data/jesus-disciple-assess.json';

export default function ResultsPage() {
  // Sample data - in production, this would come from Supabase
  const sampleResults = assessmentData.sections.map((section) => ({
    name: section.title_en.split(':')[0],
    nameChinese: section.title_zh.split(':')[0],
    score: Math.floor(Math.random() * 2) + 3.5, // Random score between 3.5-5 for demo
    maxScore: 5,
  }));

  const beingScores = sampleResults.slice(0, 5);
  const doingScores = sampleResults.slice(5, 10);

  const overallAverage = (
    sampleResults.reduce((sum, item) => sum + item.score, 0) / sampleResults.length
  ).toFixed(1);

  const beingAverage = (
    beingScores.reduce((sum, item) => sum + item.score, 0) / beingScores.length
  ).toFixed(1);

  const doingAverage = (
    doingScores.reduce((sum, item) => sum + item.score, 0) / doingScores.length
  ).toFixed(1);

  const radarData = sampleResults.map(item => ({
    area: item.name,
    score: item.score,
  }));

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
                  Completed on: {new Date().toLocaleDateString()} / 完成时间
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                Export / 导出
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
              {sampleResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold text-lg">{result.name}</h4>
                      <p className="text-sm text-gray-600">{result.nameChinese}</p>
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
        </div>
      </div>
    </div>
  );
}
