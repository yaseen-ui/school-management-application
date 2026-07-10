import { prisma } from "../../lib/prisma.js";

function mapSessionOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    checkInTime: row.checkInTime,
    checkInLat: row.checkInLat,
    checkInLng: row.checkInLng,
    checkInAccuracy: row.checkInAccuracy,
    checkInMethod: row.checkInMethod,
    checkOutTime: row.checkOutTime,
    checkOutLat: row.checkOutLat,
    checkOutLng: row.checkOutLng,
    checkOutAccuracy: row.checkOutAccuracy,
    checkOutMethod: row.checkOutMethod,
    durationMinutes: row.durationMinutes,
    createdAt: row.createdAt,
  };
}

function mapRecordOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    teacherId: row.teacherId,
    date: row.date,
    checkInTime: row.checkInTime,
    checkOutTime: row.checkOutTime,
    status: row.status,
    totalMinutes: row.totalMinutes,
    sessionCount: row.sessionCount,
    remarks: row.remarks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    teacher: row.teacher
      ? {
          id: row.teacher.id,
          fullName: row.teacher.fullName,
          employeeCode: row.teacher.employeeCode,
          employeeType: row.teacher.employeeType,
          phone: row.teacher.phone,
        }
      : null,
    sessions: row.sessions ? row.sessions.map(mapSessionOut) : [],
  };
}

class StaffAttendanceService {
  // ---- Check-in / Check-out (self-service) ----

  async checkIn(tenantId, userId, data = {}) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId, tenantId, status: "active" },
    });
    if (!teacher) {
      throw new Error("No active staff profile found for your account.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create daily parent record
    let parent = await prisma.staffAttendance.findFirst({
      where: { tenantId, teacherId: teacher.id, date: today },
    });

    if (!parent) {
      parent = await prisma.staffAttendance.create({
        data: {
          tenantId,
          teacherId: teacher.id,
          date: today,
          status: "checked_in",
          sessionCount: 1,
        },
      });
    } else {
      // Close any still-open sessions before creating new one
      await prisma.staffAttendanceSession.updateMany({
        where: { tenantId, attendanceId: parent.id, checkOutTime: null },
        data: { checkOutTime: new Date(), durationMinutes: 0 },
      });
      await prisma.staffAttendance.update({
        where: { id: parent.id },
        data: { status: "checked_in", sessionCount: { increment: 1 } },
      });
    }

    // Create new session
    const session = await prisma.staffAttendanceSession.create({
      data: {
        tenantId,
        attendanceId: parent.id,
        checkInTime: new Date(),
        checkInLat: data.lat || null,
        checkInLng: data.lng || null,
        checkInAccuracy: data.accuracy ?? null,
        checkInMethod: data.checkInMethod || "gps",
      },
    });

    // Update parent convenience fields
    await prisma.staffAttendance.update({
      where: { id: parent.id },
      data: { checkInTime: session.checkInTime },
    });

    return this._getFullRecord(parent.id, tenantId);
  }

  async checkOut(tenantId, userId, data = {}) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId, tenantId, status: "active" },
    });
    if (!teacher) {
      throw new Error("No active staff profile found for your account.");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parent = await prisma.staffAttendance.findFirst({
      where: { tenantId, teacherId: teacher.id, date: today },
    });

    if (!parent) {
      throw new Error("No check-in record found for today. Please check in first.");
    }

    // Find latest unfinished session
    const openSession = await prisma.staffAttendanceSession.findFirst({
      where: { tenantId, attendanceId: parent.id, checkOutTime: null },
      orderBy: { checkInTime: "desc" },
    });

    if (!openSession) {
      throw new Error("You are not currently checked in. All sessions are already closed.");
    }

    const now = new Date();
    const durationMs = now.getTime() - openSession.checkInTime.getTime();
    const durationMinutes = Math.round(durationMs / 60000);

    await prisma.staffAttendanceSession.update({
      where: { id: openSession.id },
      data: {
        checkOutTime: now,
        checkOutLat: data.lat || null,
        checkOutLng: data.lng || null,
        checkOutAccuracy: data.accuracy ?? null,
        checkOutMethod: data.checkOutMethod || "gps",
        durationMinutes,
      },
    });

    // Recalculate parent totals
    const allSessions = await prisma.staffAttendanceSession.findMany({
      where: { tenantId, attendanceId: parent.id },
      select: { durationMinutes: true, checkOutTime: true },
    });

    const totalMinutes = allSessions.reduce(
      (sum, s) => sum + (s.durationMinutes || 0),
      0,
    );
    const hasOpenSession = allSessions.some((s) => !s.checkOutTime);

    await prisma.staffAttendance.update({
      where: { id: parent.id },
      data: {
        checkOutTime: now,
        totalMinutes,
        status: hasOpenSession ? "checked_in" : "checked_out",
      },
    });

    return this._getFullRecord(parent.id, tenantId);
  }

  async getMyToday(tenantId, userId) {
    const teacher = await prisma.teacher.findFirst({
      where: { userId, tenantId, status: "active" },
    });
    if (!teacher) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parent = await prisma.staffAttendance.findFirst({
      where: { tenantId, teacherId: teacher.id, date: today },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
            employeeCode: true,
            employeeType: true,
            phone: true,
          },
        },
        sessions: { orderBy: { checkInTime: "asc" } },
      },
    });

    if (!parent) {
      return {
        status: "pending",
        teacher: {
          id: teacher.id,
          fullName: teacher.fullName,
          employeeCode: teacher.employeeCode,
          employeeType: teacher.employeeType,
          phone: teacher.phone,
        },
        sessions: [],
        totalMinutes: 0,
      };
    }

    return mapRecordOut(parent);
  }

  // ---- CRUD (admin) ----

  async getById(id, tenantId) {
    return this._getFullRecord(id, tenantId);
  }

  async getAll(tenantId, filters = {}) {
    const where = { tenantId };

    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.status) where.status = filters.status;

    if (filters.date) {
      const d = new Date(filters.date);
      d.setHours(0, 0, 0, 0);
      where.date = d;
    }
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        from.setHours(0, 0, 0, 0);
        where.date.gte = from;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setHours(0, 0, 0, 0);
        where.date.lte = to;
      }
    }

    const rows = await prisma.staffAttendance.findMany({
      where,
      include: {
        teacher: {
          select: { id: true, fullName: true, employeeCode: true, employeeType: true, phone: true },
        },
        sessions: { orderBy: { checkInTime: "asc" } },
      },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });

    return rows.map(mapRecordOut);
  }

  async getTodayAll(tenantId, filters = {}) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const where = { tenantId, date: today };
    if (filters.status) where.status = filters.status;
    if (filters.teacherId) where.teacherId = filters.teacherId;

    const rows = await prisma.staffAttendance.findMany({
      where,
      include: {
        teacher: {
          select: { id: true, fullName: true, employeeCode: true, employeeType: true, phone: true },
        },
        sessions: { orderBy: { checkInTime: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return rows.map(mapRecordOut);
  }

  async create(tenantId, data) {
    if (!data?.teacherId) throw new Error("Staff member is required.");
    if (!data?.date) throw new Error("Date is required.");

    const existing = await prisma.staffAttendance.findFirst({
      where: { tenantId, teacherId: data.teacherId, date: new Date(data.date) },
    });

    if (existing) {
      return this.update(existing.id, tenantId, data);
    }

    const created = await prisma.staffAttendance.create({
      data: {
        tenantId,
        teacherId: data.teacherId,
        date: new Date(data.date),
        status: data.status || "pending",
        totalMinutes: data.totalMinutes || 0,
        sessionCount: data.sessionCount || 0,
        remarks: data.remarks || null,
      },
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true, employeeType: true, phone: true } },
        sessions: { orderBy: { checkInTime: "asc" } },
      },
    });

    return mapRecordOut(created);
  }

  async update(id, tenantId, data) {
    const existing = await prisma.staffAttendance.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    const toUpdate = {};
    if (data.status !== undefined) toUpdate.status = data.status;
    if (data.totalMinutes !== undefined) toUpdate.totalMinutes = data.totalMinutes;
    if (data.remarks !== undefined) toUpdate.remarks = data.remarks || null;

    if (Object.keys(toUpdate).length > 0) {
      await prisma.staffAttendance.update({ where: { id }, data: toUpdate });
    }

    return this._getFullRecord(id, tenantId);
  }

  async delete(id, tenantId) {
    const existing = await prisma.staffAttendance.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    await prisma.staffAttendanceSession.deleteMany({ where: { attendanceId: id, tenantId } });
    await prisma.staffAttendance.delete({ where: { id } });

    return mapRecordOut(existing);
  }

  // ---- Reports ----

  async getReport(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom);
        from.setHours(0, 0, 0, 0);
        where.date.gte = from;
      }
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setHours(0, 0, 0, 0);
        where.date.lte = to;
      }
    }

    const records = await prisma.staffAttendance.findMany({
      where,
      include: {
        teacher: { select: { id: true, fullName: true, employeeCode: true, employeeType: true } },
      },
      orderBy: { date: "asc" },
    });

    const teacherMap = new Map();
    for (const r of records) {
      const tid = r.teacherId;
      if (!teacherMap.has(tid)) {
        teacherMap.set(tid, {
          teacher: r.teacher,
          totalDays: 0,
          checkedIn: 0,
          checkedOut: 0,
          absent: 0,
          onLeave: 0,
          pending: 0,
          totalMinutes: 0,
        });
      }
      const stats = teacherMap.get(tid);
      stats.totalDays++;
      stats.totalMinutes += r.totalMinutes || 0;
      switch (r.status) {
        case "checked_in": stats.checkedIn++; break;
        case "checked_out": stats.checkedOut++; break;
        case "absent": stats.absent++; break;
        case "on_leave": stats.onLeave++; break;
        default: stats.pending++; break;
      }
    }

    const summary = {
      totalRecords: records.length,
      presentAndCheckedOut: records.filter((r) => r.status === "checked_out").length,
      checkedInOnly: records.filter((r) => r.status === "checked_in").length,
      absent: records.filter((r) => r.status === "absent").length,
      onLeave: records.filter((r) => r.status === "on_leave").length,
      pending: records.filter((r) => r.status === "pending").length,
      totalMinutes: records.reduce((s, r) => s + (r.totalMinutes || 0), 0),
    };

    return { summary, perTeacher: Array.from(teacherMap.values()) };
  }

  // ---- Helpers ----

  async _getFullRecord(id, tenantId) {
    const row = await prisma.staffAttendance.findFirst({
      where: { id, tenantId },
      include: {
        teacher: {
          select: { id: true, fullName: true, employeeCode: true, employeeType: true, phone: true },
        },
        sessions: { orderBy: { checkInTime: "asc" } },
      },
    });
    return mapRecordOut(row);
  }
}

export default new StaffAttendanceService();