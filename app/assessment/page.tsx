'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import assessmentData from '@/data/jesus-disciple-assess.json';

export default function AssessmentPage() {
  const router = useRouter();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const currentSection = assessmentData.sections[currentSectionIndex];
  const totalSections = assessmentData.sections.length;
  const progress = ((currentSectionIndex + 1) / totalSections) * 100;

  const handleAnswer = (itemId: string, score: number) => {
    setAnswers({ ...answers, [itemId]: score });
  };

  const handleNext = () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    // TODO: Save to Supabase
    console.log('Assessment Results:', answers);
    const totalQuestions = assessmentData.sections.reduce(
      (sum, section) => sum + section.items.length,
      0
    );
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredQuestions} out of ${totalQuestions} questions. Submit anyway?\n您已回答 ${answeredQuestions} / ${totalQuestions} 题。确认提交吗?`
      );
      if (!confirmSubmit) return;
    }

    router.push('/results');
  };

  const allItemsInSectionAnswered = currentSection.items.every(
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
                <span>Section {currentSectionIndex + 1} of {totalSections}</span>
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

          {/* Section Title */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {currentSection.title_en}
            </h3>
            <h4 className="text-xl text-gray-700">
              {currentSection.title_zh}
            </h4>
          </div>

          {/* Questions */}
          <div className="space-y-8 mb-8">
            {currentSection.items.map((item, index) => (
              <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="mb-4">
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {index + 1}. {item.text_en}
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
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentSectionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentSectionIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous / 上一页
            </button>

            {currentSectionIndex === totalSections - 1 ? (
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

          {/* Section Completion Indicator */}
          {!allItemsInSectionAnswered && (
            <div className="mt-4 text-center text-sm text-amber-600">
              Please answer all questions in this section / 请回答本节所有问题
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
