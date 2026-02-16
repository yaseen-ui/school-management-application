import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'

// Thin adapter for /api/courses/[id]

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'getCourseById', req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'updateCourse', req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'deleteCourse', req, params)
}