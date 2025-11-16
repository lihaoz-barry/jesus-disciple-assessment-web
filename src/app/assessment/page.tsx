'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Question {
  id: number
  category: string
  text_en: string
  text_zh: string
}

interface AssessmentData {
  title: string
  description: string
  questions: Question[]
  scale: {
    [key: string]: string
  }
}

export default function AssessmentPage() {
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [user, setUser] = useState<{ email?: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }
      
      setUser(user)
    }

    const loadAssessment = async () => {
      try {
        const response = await fetch('/data/jesus-disciple-profile.en-zh.json')
        const data = await response.json()
        setAssessmentData(data)
      } catch (error) {
        console.error('Error loading assessment data:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
    loadAssessment()
  }, [router, supabase.auth])

  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Check if all questions are answered
    if (!assessmentData) return

    const unanswered = assessmentData.questions.filter(
      (q) => !answers[q.id]
    )

    if (unanswered.length > 0) {
      alert(`Please answer all questions. ${unanswered.length} question(s) remaining.`)
      setSubmitting(false)
      return
    }

    // Log submission (as per requirements)
    console.log('Assessment Submission:', {
      user: user?.email,
      timestamp: new Date().toISOString(),
      answers: answers,
      summary: {
        totalQuestions: assessmentData.questions.length,
        averageScore:
          Object.values(answers).reduce((a, b) => a + b, 0) /
          Object.values(answers).length,
      },
    })

    // In a real application, this would be saved to Supabase
    // For now, we'll just log it and show success message
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessmentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading assessment data</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Assessment Complete!
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for completing the Jesus Disciple Profile assessment.
              Your responses have been recorded.
            </p>
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {assessmentData.title}
            </h1>
            <p className="text-gray-600">{assessmentData.description}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {assessmentData.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0"
                >
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Question {index + 1} - {question.category}
                    </p>
                    <p className="text-lg font-medium text-gray-900">
                      {question.text_en}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {question.text_zh}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label
                        key={value}
                        className="flex items-center space-x-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={value}
                          checked={answers[question.id] === value}
                          onChange={() => handleAnswerChange(question.id, value)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900">
                          {value} - {assessmentData.scale[value.toString()]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {Object.keys(answers).length} of {assessmentData.questions.length} questions answered
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
