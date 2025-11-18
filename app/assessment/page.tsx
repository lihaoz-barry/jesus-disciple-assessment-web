'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import assessmentData from '@/data/jesus-disciple-assess.json';

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

  const handleSubmit = () => {
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

    console.log('Assessment Results:', {
      answers,
      scores,
      sectionScores
    });

    // Store results in sessionStorage to pass to results page
    sessionStorage.setItem('assessmentResults', JSON.stringify({
      answers,
      scores,
      completed_at: new Date().toISOString()
    }));

    router.push('/results');
  };

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
          <div className="space-y-8 mb-8">
            {currentPageQuestions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="mb-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {startIndex + index + 1}. {question.text_en}
                  </p>
                  <p className="text-gray-700">
                    {question.text_zh}
                  </p>
                </div>

                {/* Rating Scale */}
                <div className="flex flex-wrap gap-2">
                  {assessmentData.scale.labels.map((label) => (
                    <button
                      key={label.value}
                      onClick={() => handleAnswer(question.id, label.value)}
                      className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg border-2 transition-all ${
                        answers[question.id] === label.value
                          ? 'border-blue-600 bg-blue-600 text-white shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold text-lg">{label.value}</div>
                      <div className="text-xs mt-1">{label.label_en}</div>
                      <div className="text-xs">{label.label_zh}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentPage === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous / 上一页
            </button>

            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} / {totalQuestions} answered
            </div>

            {currentPage === totalPages - 1 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Save className="w-5 h-5" />
                Submit / 提交
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
        </div>
      </div>
    </div>
  );
}
