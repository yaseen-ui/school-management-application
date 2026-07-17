import { NextRequest, NextResponse } from 'next/server'
import { invokeBackendController } from '@/lib/api/server-adapter'
import { Guard } from '@/lib/backend/rbac/guards.js'

export async function GET(req: NextRequest) {
  await Guard.action(req, 'courses:read');
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'getAllCourses', req)
}

export async function POST(req: NextRequest) {
  await Guard.action(req, 'courses:write');
  const CourseController = (await import('@backend/modules/courses/courses.controller.js')).default
  return invokeBackendController(CourseController, 'createCourse', req)
}