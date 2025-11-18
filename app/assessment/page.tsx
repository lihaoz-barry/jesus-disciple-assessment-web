'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import assessmentData from '@/data/jesus-disciple-assess.json';
import { useAuth } from '@/contexts/AuthContext';
import { saveAssessmentResult } from '@/lib/database';

// Interface for flattened question with category metadata
interface FlattenedQuestion {
  id: string;
  sectionId: string;
  sectionTitle_en: string;
  sectionTitle_zh: string;
  text_en: string;
  text_zh: string;
  originalIndex: number;
}

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Flatten and randomize questions on component mount
  const randomizedQuestions = useMemo(() => {
    const allQuestions: FlattenedQuestion[] = [];

    // Flatten all questions from all sections
    assessmentData.sections.forEach((section) => {
      section.items.forEach((item, idx) => {
        allQuestions.push({
          id: item.id,
          sectionId: section.id,
          sectionTitle_en: section.title_en,
          sectionTitle_zh: section.title_zh,
          text_en: item.text_en,
          text_zh: item.text_zh,
          originalIndex: idx
        });
      });
    });

    // Shuffle using Fisher-Yates algorithm
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, []); // Empty dependency array ensures this only runs once

  const QUESTIONS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const totalQuestions = randomizedQuestions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, totalQuestions);
  const currentPageQuestions = randomizedQuestions.slice(startIndex, endIndex);
  const progress = ((endIndex) / totalQuestions) * 100;

  const handleAnswer = (itemId: string, score: number) => {
    setAnswers({ ...answers, [itemId]: score });
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredQuestions} out of ${totalQuestions} questions. Submit anyway?\n您已回答 ${answeredQuestions} / ${totalQuestions} 题。确认提交吗?`
      );
      if (!confirmSubmit) return;
    }

    // Calculate scores by section
    const sectionScores: Record<string, { total: number; count: number }> = {};

    randomizedQuestions.forEach((question) => {
      const score = answers[question.id];
      if (score !== undefined) {
        if (!sectionScores[question.sectionId]) {
          sectionScores[question.sectionId] = { total: 0, count: 0 };
        }
        sectionScores[question.sectionId].total += score;
        sectionScores[question.sectionId].count += 1;
      }
    });

    // Calculate averages
    const scores: Record<string, number> = {};
    Object.keys(sectionScores).forEach((sectionId) => {
      const { total, count } = sectionScores[sectionId];
      scores[sectionId] = count > 0 ? total / count : 0;
    });

    const resultsData = {
      answers,
      scores,
      completed_at: new Date().toISOString()
    };

    // Save to Supabase if user is logged in
    if (user) {
      try {
        const result = await saveAssessmentResult(user.id, answers, scores);
        if (result.success) {
          console.log('Assessment saved to database:', result.id);
          // Store the database ID in sessionStorage for results page
          sessionStorage.setItem('assessmentResults', JSON.stringify({
            ...resultsData,
            id: result.id
          }));
        } else {
          console.error('Failed to save to database:', result.error);
          // Still save to sessionStorage as backup
          sessionStorage.setItem('assessmentResults', JSON.stringify(resultsData));
        }
      } catch (error) {
        console.error('Error saving assessment:', error);
        // Fallback to sessionStorage
        sessionStorage.setItem('assessmentResults', JSON.stringify(resultsData));
      }
    } else {
      // User not logged in, only save to sessionStorage
      console.warn('User not logged in, saving only to sessionStorage');
      sessionStorage.setItem('assessmentResults', JSON.stringify(resultsData));
    }

    router.push('/results');
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8">
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-3 sm:mb-4 text-sm sm:text-base">
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Back to Dashboard / 返回控制面板</span>
            </Link>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              {assessmentData.name_en}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-2 sm:mb-4">
              {assessmentData.name_zh}
            </h2>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Questions {startIndex + 1}-{endIndex} of {totalQuestions} (Page {currentPage + 1}/{totalPages})</span>
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
          <div className="space-y-4 sm:space-y-6 md:space-y-8 mb-4 sm:mb-8">
            {currentPageQuestions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0">
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm sm:text-base md:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
                    {startIndex + index + 1}. {question.text_en}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700">
                    {question.text_zh}
                  </p>
                </div>

                {/* Rating Scale - Compact on mobile */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {assessmentData.scale.labels.map((label) => (
                    <button
                      key={label.value}
                      onClick={() => handleAnswer(question.id, label.value)}
                      className={`flex-1 min-w-[55px] sm:min-w-[100px] px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 rounded-lg border-2 transition-all ${
                        answers[question.id] === label.value
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="font-bold text-base sm:text-lg">{label.value}</div>
                      <div className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 leading-tight">{label.label_en}</div>
                      <div className="text-[10px] sm:text-xs leading-tight">{label.label_zh}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-0">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Previous / 上一页</span>
              <span className="sm:hidden">上一页</span>
            </button>

            <div className="text-xs sm:text-sm text-gray-500 order-first sm:order-none">
              {Object.keys(answers).length} / {totalQuestions} answered
            </div>

            {currentPage === totalPages - 1 ? (
              <button
                onClick={handleSubmit}
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Submit / 提交</span>
                <span className="sm:hidden">提交</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Next / 下一页</span>
                <span className="sm:hidden">下一页</span>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
