import { prisma } from "../../lib/prisma.js";

// Map numeric day of week (0=Monday, 1=Tuesday, etc.) to Prisma enum values
const DAY_OF_WEEK_MAP = {
  0: "Monday",
  1: "Tuesday",
  2: "Wednesday",
  3: "Thursday",
  4: "Friday",
  5: "Saturday",
};

// Reverse map: Prisma enum string -> number
const DAY_OF_WEEK_REVERSE_MAP = {
  "Monday": 0,
  "Tuesday": 1,
  "Wednesday": 2,
  "Thursday": 3,
  "Friday": 4,
  "Saturday": 5,
};

function mapDayOfWeekToEnum(value) {
  if (value === undefined || value === null) return undefined;
  // If it's already a valid enum string, return as-is
  if (typeof value === "string" && DAY_OF_WEEK_MAP[value] === undefined && Object.values(DAY_OF_WEEK_MAP).includes(value)) {
    return value;
  }
  // If it's a number (0-5), map to enum string
  return DAY_OF_WEEK_MAP[value] || value;
}

function mapDayOfWeekFromEnum(value) {
  if (!value) return value;
  // If it's a string enum value like "Monday", convert to number 0
  if (typeof value === "string" && DAY_OF_WEEK_REVERSE_MAP[value] !== undefined) {
    return DAY_OF_WEEK_REVERSE_MAP[value];
  }
  return value;
}

function mapEntryIn(data = {}, tenantId) {
  const out = { tenantId };

  if (data.academicYearId !== undefined) out.academicYearId = data.academicYearId;
  if (data.dayOfWeek !== undefined) out.dayOfWeek = mapDayOfWeekToEnum(data.dayOfWeek);
  if (data.periodId !== undefined) out.periodId = data.periodId;
  if (data.sectionSubjectId !== undefined) out.sectionSubjectId = data.sectionSubjectId;
  if (data.teacherAssignmentId !== undefined) out.teacherAssignmentId = data.teacherAssignmentId;
  if (data.room !== undefined) out.room = data.room || null;

  return out;
}

function mapEntryOut(row) {
  if (!row) return null;

  return {
    id: row.id,
    tenantId: row.tenantId,
    academicYearId: row.academicYearId,
    dayOfWeek: mapDayOfWeekFromEnum(row.dayOfWeek),
    periodId: row.periodId,
    sectionSubjectId: row.sectionSubjectId,
    teacherAssignmentId: row.teacherAssignmentId,
    room: row.room,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    academicYear: row.academicYear
      ? { id: row.academicYear.id, name: row.academicYear.name }
      : null,
    period: row.period
      ? { id: row.period.id, name: row.period.name, startTime: row.period.startTime, endTime: row.period.endTime, sortOrder: row.period.sortOrder }
      : null,
    sectionSubject: row.sectionSubject
      ? {
          id: row.sectionSubject.id,
          section: row.sectionSubject.section
            ? { id: row.sectionSubject.section.id, sectionName: row.sectionSubject.section.sectionName }
            : null,
          subject: row.sectionSubject.subject
            ? { id: row.sectionSubject.subject.id, subjectName: row.sectionSubject.subject.subjectName }
            : null,
        }
      : null,
    teacherAssignment: row.teacherAssignment
      ? {
          id: row.teacherAssignment.id,
          teacher: row.teacherAssignment.teacher
            ? { id: row.teacherAssignment.teacher.id, fullName: row.teacherAssignment.teacher.fullName }
            : null,
        }
      : null,
  };
}

class TimetableEntryService {
  async create(data, tenantId) {
    if (!data?.academicYearId) throw new Error("Academic year is required.");
    if (data?.dayOfWeek === undefined || data?.dayOfWeek === null) throw new Error("Day of week is required.");
    if (!data?.periodId) throw new Error("Period is required.");
    if (!data?.sectionSubjectId) throw new Error("Section subject is required.");

    const toCreate = mapEntryIn(data, tenantId);

    // Check for duplicate entry (same year, day, period, section-subject)
    const existing = await prisma.timetableEntry.findFirst({
      where: {
        tenantId,
        academicYearId: toCreate.academicYearId,
        dayOfWeek: toCreate.dayOfWeek,
        periodId: toCreate.periodId,
        sectionSubjectId: toCreate.sectionSubjectId,
      },
    });
    if (existing) {
      throw new Error("A timetable entry already exists for this period, day, and section.");
    }
    const created = await prisma.timetableEntry.create({
      data: toCreate,
      include: {
        academicYear: { select: { id: true, name: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true, sortOrder: true } },
        sectionSubject: {
          select: {
            id: true,
            section: { select: { id: true, sectionName: true } },
            subject: { select: { id: true, subjectName: true } },
          },
        },
        teacherAssignment: {
          select: {
            id: true,
            teacher: { select: { id: true, fullName: true } },
          },
        },
      },
    });

    return mapEntryOut(created);
  }

  async getById(id, tenantId) {
    const row = await prisma.timetableEntry.findFirst({
      where: { id, tenantId },
      include: {
        academicYear: { select: { id: true, name: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true, sortOrder: true } },
        sectionSubject: {
          select: {
            id: true,
            section: { select: { id: true, sectionName: true } },
            subject: { select: { id: true, subjectName: true } },
          },
        },
        teacherAssignment: {
          select: {
            id: true,
            teacher: { select: { id: true, fullName: true } },
          },
        },
      },
    });
    return mapEntryOut(row);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters.sectionSubjectId) where.sectionSubjectId = filters.sectionSubjectId;
    if (filters.periodId) where.periodId = filters.periodId;
    if (filters.dayOfWeek) where.dayOfWeek = mapDayOfWeekToEnum(filters.dayOfWeek);

    // Support filtering by sectionId through sectionSubject relation
    if (filters.sectionId) {
      where.sectionSubject = { sectionId: filters.sectionId };
    }

    const rows = await prisma.timetableEntry.findMany({
      where,
      include: {
        academicYear: { select: { id: true, name: true } },
        period: { select: { id: true, name: true, startTime: true, endTime: true, sortOrder: true } },
        sectionSubject: {
          select: {
            id: true,
            section: { select: { id: true, sectionName: true } },
            subject: { select: { id: true, subjectName: true } },
          },
        },
        teacherAssignment: {
          select: {
            id: true,
            teacher: { select: { id: true, fullName: true } },
          },
        },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { period: { sortOrder: "asc" } },
      ],
    });

    return rows.map(mapEntryOut);
  }

  async update(id, data, tenantId) {
    const existing = await prisma.timetableEntry.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    const toUpdate = mapEntryIn(data, tenantId);
    delete toUpdate.tenantId;
    delete toUpdate.academicYearId; // Don't allow changing academic year
    delete toUpdate.sectionSubjectId; // Don't allow changing section-subject

    Object.keys(toUpdate).forEach((k) => toUpdate[k] === undefined && delete toUpdate[k]);

    await prisma.timetableEntry.update({
      where: { id },
      data: toUpdate,
    });

    return this.getById(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.timetableEntry.findFirst({
      where: { id, tenantId },
    });
    if (!existing) return null;

    await prisma.timetableEntry.delete({
      where: { id },
    });

    return mapEntryOut(existing);
  }

  // Bulk create entries for a section's timetable grid
  async bulkCreate(entries, tenantId) {
    if (!Array.isArray(entries) || entries.length === 0) {
      throw new Error("Entries array is required.");
    }

    const results = [];
    const errors = [];

    for (const entry of entries) {
      try {
        const created = await this.create(entry, tenantId);
        results.push(created);
      } catch (error) {
        errors.push({ entry, error: error.message });
      }
    }

    return { results, errors };
  }

  // Get timetable grid for a section (grouped by day)
  async getGridForSection(tenantId, sectionId, academicYearId) {
    const entries = await prisma.timetableEntry.findMany({
      where: {
        tenantId,
        academicYearId,
        sectionSubject: { sectionId },
      },
      include: {
        period: { select: { id: true, name: true, startTime: true, endTime: true, sortOrder: true } },
        sectionSubject: {
          select: {
            id: true,
            section: { select: { id: true, sectionName: true } },
            subject: { select: { id: true, subjectName: true } },
          },
        },
        teacherAssignment: {
          select: {
            id: true,
            teacher: { select: { id: true, fullName: true } },
          },
        },
      },
      orderBy: [
        { dayOfWeek: "asc" },
        { period: { sortOrder: "asc" } },
      ],
    });

    return entries.map(mapEntryOut);
  }
}

export default new TimetableEntryService();
