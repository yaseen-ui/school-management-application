import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/courses

export async function GET(req: NextRequest) {
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'getAllCourses', req)
}

export async function POST(req: NextRequest) {
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'createCourse', req)
}