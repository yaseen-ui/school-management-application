// src/modules/courses/course.service.js  (Prisma version)
import { prisma } from "../../lib/prisma.js";

class CourseService {
  static async createCourse(data) {
    return prisma.course.create({
      data,
      include: { grades: true },
    });
  }

  static async getAllCourses(tenantId) {
    return prisma.course.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getCourseById(courseId, tenantId) {
    return prisma.course.findFirst({
      where: { id: courseId, tenantId },
    });
  }

  static async updateCourse(courseId, updates, tenantId) {
    const result = await prisma.course.updateMany({
      where: { id: courseId, tenantId },
      data: updates,
    });

    if (result.count === 1) {
      return prisma.course.findFirst({
        where: { id: courseId, tenantId },
      });
    }
    return { count: result.count };
  }

  static async deleteCourse(courseId, tenantId) {
    const result = await prisma.course.deleteMany({
      where: { id: courseId, tenantId },
    });
    return { count: result.count };
  }
}

export default CourseService;
