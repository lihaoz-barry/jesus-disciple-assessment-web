'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import assessmentData from '@/data/jesus-disciple-assess.json';
import { shuffleAssessmentItems, groupItemsIntoPages, calculateSectionScores } from '@/lib/assessment-utils';
import { useAuth } from '@/contexts/AuthContext';
import { saveAssessmentResult } from '@/lib/database';

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shuffle items once on mount and group into pages
  const { shuffledItems, pages } = useMemo(() => {
    const shuffled = shuffleAssessmentItems(assessmentData);
    const grouped = groupItemsIntoPages(shuffled, 5);
    return { shuffledItems: shuffled, pages: grouped };
  }, []);

  const totalPages = pages.length;
  const currentPage = pages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / totalPages) * 100;

  const handleAnswer = (itemId: string, score: number) => {
    setAnswers({ ...answers, [itemId]: score });
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    const totalQuestions = shuffledItems.length;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredQuestions} out of ${totalQuestions} questions. Submit anyway?\n您已回答 ${answeredQuestions} / ${totalQuestions} 题。确认提交吗?`
      );
      if (!confirmSubmit) return;
    }

    if (!user) {
      alert('Please log in to save your results / 请登录以保存结果');
      router.push('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate section scores
      const sectionScores = calculateSectionScores(answers, shuffledItems);

      // Convert to simple object for storage
      const scores: Record<string, number> = {};
      Object.entries(sectionScores).forEach(([sectionId, data]) => {
        scores[sectionId] = data.average;
      });

      // Save to database
      const result = await saveAssessmentResult(user.id, answers, scores);

      if (result.success) {
        // Store result ID in sessionStorage to display on results page
        if (result.id) {
          sessionStorage.setItem('latestAssessmentId', result.id);
        }
        router.push('/results');
      } else {
        alert(`Error saving results: ${result.error}\n保存结果时出错: ${result.error}`);
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error('Error submitting assessment:', error);
      alert(`Error: ${error.message}\n错误: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  const allItemsInPageAnswered = currentPage.every(
    (item) => answers[item.id] !== undefined
  );

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-4">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Dashboard / 返回控制面板</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {assessmentData.name_en}
            </h1>
            <h2 className="text-2xl text-gray-700 mb-4">
              {assessmentData.name_zh}
            </h2>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Page {currentPageIndex + 1} of {totalPages}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-8 mb-8">
            {currentPage.map((item, pageIndex) => {
              const globalIndex = currentPageIndex * 5 + pageIndex + 1;
              return (
                <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="mb-4">
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {globalIndex}. {item.text_en}
                    </p>
                    <p className="text-gray-600">
                      {item.text_zh}
                    </p>
                  </div>

                  {/* Rating Scale */}
                  <div className="flex flex-wrap gap-2">
                    {assessmentData.scale.labels.map((label) => (
                      <button
                        key={label.value}
                        onClick={() => handleAnswer(item.id, label.value)}
                        className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg border-2 transition-all ${
                          answers[item.id] === label.value
                            ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400'
                        }`}
                      >
                        <div className="font-semibold">{label.value}</div>
                        <div className="text-xs">{label.label_en}</div>
                        <div className="text-xs">{label.label_zh}</div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentPageIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentPageIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous / 上一页
            </button>

            {currentPageIndex === totalPages - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isSubmitting
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Save className="w-5 h-5" />
                {isSubmitting ? 'Submitting... / 提交中...' : 'Submit / 提交'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Next / 下一页
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Page Completion Indicator */}
          {!allItemsInPageAnswered && (
            <div className="mt-4 text-center text-sm text-amber-600">
              Please answer all questions on this page / 请回答本页所有问题
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
