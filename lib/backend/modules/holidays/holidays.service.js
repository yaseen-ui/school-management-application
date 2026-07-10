import { prisma } from "../../lib/prisma.js";

// ─── Mappers ─────────────────────────────────────────────────────────────────

function mapHolidayCategoryOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    description: row.description,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapHolidayOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    academicYearId: row.academicYearId,
    categoryId: row.categoryId,
    categoryName: row.category?.name || null,
    date: row.date,
    name: row.name,
    type: row.type,
    isMandatory: row.isMandatory,
    fullDay: row.fullDay,
    remarks: row.remarks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function mapHolidayRuleOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    academicYearId: row.academicYearId,
    name: row.name,
    ruleType: row.ruleType,
    dayOfWeek: row.dayOfWeek,
    weekOfMonth: row.weekOfMonth,
    isActive: row.isActive,
    remarks: row.remarks,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ──────────────────────────────────────────────────────────────────────────────

class HolidaysService {
  // ==================== HOLIDAY CATEGORIES ====================

  async createCategory(data, tenantId) {
    if (!data?.name) throw new Error("Category name is required.");
    const existing = await prisma.holidayCategory.findFirst({
      where: { tenantId, name: data.name },
    });
    if (existing) throw new Error("A category with this name already exists.");
    const row = await prisma.holidayCategory.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description || null,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        createdById: data.createdById || null,
      },
    });
    return mapHolidayCategoryOut(row);
  }

  async getAllCategories(tenantId) {
    const rows = await prisma.holidayCategory.findMany({
      where: { tenantId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(mapHolidayCategoryOut);
  }

  async getCategoryById(id, tenantId) {
    const row = await prisma.holidayCategory.findFirst({ where: { id, tenantId } });
    return mapHolidayCategoryOut(row);
  }

  async updateCategory(id, data, tenantId) {
    const existing = await prisma.holidayCategory.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    const updateData = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    await prisma.holidayCategory.update({ where: { id }, data: updateData });
    return this.getCategoryById(id, tenantId);
  }

  async deleteCategory(id, tenantId) {
    const existing = await prisma.holidayCategory.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    const holidayCount = await prisma.holiday.count({ where: { categoryId: id, tenantId } });
    if (holidayCount > 0)
      throw new Error("Cannot delete category that has holidays assigned to it.");
    await prisma.holidayCategory.delete({ where: { id } });
    return mapHolidayCategoryOut(existing);
  }

  // ─── HOLIDAYS ───────────────────────────────────────────────────────────────

  async createHoliday(data, tenantId) {
    if (!data?.date) throw new Error("Date is required.");
    if (!data?.name) throw new Error("Holiday name is required.");

    const createData = {
      tenantId,
      academicYearId: data.academicYearId || null,
      categoryId: data.categoryId || null,
      date: new Date(data.date),
      name: data.name,
      type: data.type || "school",
      isMandatory: data.isMandatory ?? true,
      fullDay: data.fullDay ?? true,
      remarks: data.remarks || null,
      createdById: data.createdById || null,
    };

    const row = await prisma.holiday.create({
      data: createData,
      include: {
        category: { select: { name: true } },
      },
    });
    return mapHolidayOut(row);
  }

  async getAllHolidays(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.type) where.type = filters.type;
    if (filters.isMandatory !== undefined) where.isMandatory = filters.isMandatory;

    if (filters.fromDate || filters.toDate) {
      where.date = {};
      if (filters.fromDate) where.date.gte = new Date(filters.fromDate);
      if (filters.toDate) where.date.lte = new Date(filters.toDate);
    }

    const rows = await prisma.holiday.findMany({
      where,
      include: {
        category: { select: { name: true } },
      },
      orderBy: [{ date: "asc" }, { name: "asc" }],
    });
    return rows.map(mapHolidayOut);
  }

  async getHolidayById(id, tenantId) {
    const row = await prisma.holiday.findFirst({
      where: { id, tenantId },
      include: {
        category: { select: { name: true } },
      },
    });
    return mapHolidayOut(row);
  }

  async updateHoliday(id, data, tenantId) {
    const existing = await prisma.holiday.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    const updateData = {};
    if (data.academicYearId !== undefined) updateData.academicYearId = data.academicYearId;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.name !== undefined) updateData.name = data.name;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.isMandatory !== undefined) updateData.isMandatory = data.isMandatory;
    if (data.fullDay !== undefined) updateData.fullDay = data.fullDay;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    await prisma.holiday.update({ where: { id }, data: updateData });
    return this.getHolidayById(id, tenantId);
  }

  async deleteHoliday(id, tenantId) {
    const existing = await prisma.holiday.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    await prisma.holiday.delete({ where: { id } });
    return mapHolidayOut(existing);
  }

  // ─── HOLIDAY RULES ──────────────────────────────────────────────────────────

  async createRule(data, tenantId) {
    if (!data?.name) throw new Error("Rule name is required.");
    if (!data?.ruleType) throw new Error("Rule type is required.");
    if (!data?.dayOfWeek) throw new Error("Day of week is required.");

    if (
      data.ruleType === "nth_weekday_of_month" &&
      (data.weekOfMonth == null || data.weekOfMonth < 1 || data.weekOfMonth > 5)
    ) {
      throw new Error("weekOfMonth (1-5) is required for nth_weekday_of_month rules.");
    }

    const row = await prisma.tenantHolidayRule.create({
      data: {
        tenantId,
        academicYearId: data.academicYearId || null,
        name: data.name,
        ruleType: data.ruleType,
        dayOfWeek: data.dayOfWeek,
        weekOfMonth: data.weekOfMonth || null,
        isActive: data.isActive ?? true,
        remarks: data.remarks || null,
        createdById: data.createdById || null,
      },
    });
    return mapHolidayRuleOut(row);
  }

  async getAllRules(tenantId, filters = {}) {
    const where = { tenantId };
    if (filters.academicYearId) where.academicYearId = filters.academicYearId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    const rows = await prisma.tenantHolidayRule.findMany({
      where,
      orderBy: [{ createdAt: "asc" }],
    });
    return rows.map(mapHolidayRuleOut);
  }

  async getRuleById(id, tenantId) {
    const row = await prisma.tenantHolidayRule.findFirst({ where: { id, tenantId } });
    return mapHolidayRuleOut(row);
  }

  async updateRule(id, data, tenantId) {
    const existing = await prisma.tenantHolidayRule.findFirst({ where: { id, tenantId } });
    if (!existing) return null;

    const updateData = {};
    if (data.academicYearId !== undefined) updateData.academicYearId = data.academicYearId;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.ruleType !== undefined) updateData.ruleType = data.ruleType;
    if (data.dayOfWeek !== undefined) updateData.dayOfWeek = data.dayOfWeek;
    if (data.weekOfMonth !== undefined) updateData.weekOfMonth = data.weekOfMonth;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    await prisma.tenantHolidayRule.update({ where: { id }, data: updateData });
    return this.getRuleById(id, tenantId);
  }

  async deleteRule(id, tenantId) {
    const existing = await prisma.tenantHolidayRule.findFirst({ where: { id, tenantId } });
    if (!existing) return null;
    await prisma.tenantHolidayRule.delete({ where: { id } });
    return mapHolidayRuleOut(existing);
  }
}

export default new HolidaysService();