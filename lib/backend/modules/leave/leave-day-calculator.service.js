import { prisma } from "../../lib/prisma.js";

/**
 * Reusable domain service for calculating working leave days.
 * Considers tenant working days, weekends, holidays, half-day fractions,
 * and academic year boundaries.
 */
class LeaveDayCalculator {
  /**
   * @param {{
   *   tenantId: string,
   *   startDate: Date,
   *   endDate: Date,
   *   startFraction?: 'full_day' | 'first_half' | 'second_half',
   *   endFraction?: 'full_day' | 'first_half' | 'second_half',
   *   employeeId?: string,
   *   academicYearId?: string,
   * }} params
   * @returns {Promise<{ calculatedDays: number, breakdown: Array<{date: string, fraction: number, isWorkingDay: boolean, isHoliday: boolean, holidayName?: string}> }>}
   */
  async calculateDays(params) {
    const {
      tenantId,
      startDate,
      endDate,
      startFraction = "full_day",
      endFraction = "full_day",
      employeeId,
      academicYearId,
    } = params;

    // Validate date range
    if (endDate < startDate) {
      throw new Error("End date cannot be before start date.");
    }

    // Get tenant configuration
    const config = await prisma.tenantLeaveConfiguration.findUnique({
      where: { tenantId },
    });

    const workingDays = config?.workingDays || [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
    ];
    const allowSaturdayHalfDay = config?.allowSaturdayHalfDay || false;

    // Get holidays in the date range
    const holidays = await prisma.holiday.findMany({
      where: {
        tenantId,
        date: { gte: startDate, lte: endDate },
        type: { not: "optional" }, // Exclude optional holidays by default
      },
      select: { date: true, name: true, type: true, fullDay: true },
    });

    const holidayMap = new Map();
    for (const h of holidays) {
      const key = h.date.toISOString().split("T")[0];
      holidayMap.set(key, h);
    }

    // Build the date-by-date breakdown
    const breakdown = [];
    let totalDays = 0;
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dateKey = current.toISOString().split("T")[0];
      const dayOfWeek = current.toLocaleDateString("en-US", { weekday: "long" });
      const isWorkingDay = workingDays.includes(dayOfWeek);
      const holiday = holidayMap.get(dateKey);
      const isHoliday = !!holiday && holiday.fullDay;

      let dayFraction = 0;

      if (!isHoliday) {
        if (isWorkingDay) {
          dayFraction = 1.0;
        } else if (
          dayOfWeek === "Saturday" &&
          allowSaturdayHalfDay &&
          workingDays.includes("Saturday")
        ) {
          dayFraction = 0.5;
        }

        // Apply startFraction / endFraction for first and last day
        const isFirstDay = current.getTime() === startDate.getTime();
        const isLastDay = current.getTime() === endDate.getTime();

        if (isFirstDay && isLastDay) {
          // Single day leave
          if (startFraction === "first_half" && endFraction === "second_half") {
            dayFraction = 1.0; // Both halves = full day
          } else if (startFraction === "first_half" && endFraction === "first_half") {
            dayFraction = Math.min(dayFraction, 0.5);
          } else if (startFraction === "second_half" && endFraction === "second_half") {
            dayFraction = Math.min(dayFraction, 0.5);
          } else if (startFraction === "first_half") {
            dayFraction = Math.min(dayFraction, 0.5);
          } else if (startFraction === "second_half") {
            dayFraction = Math.min(dayFraction, 0.5);
          }
          // full_day stays as is
        } else if (isFirstDay) {
          if (startFraction === "second_half") {
            dayFraction = Math.min(dayFraction, 0.5);
          } else if (startFraction === "first_half") {
            dayFraction = Math.min(dayFraction, 1.0);
          }
          // full_day stays as is
        } else if (isLastDay) {
          if (endFraction === "first_half") {
            dayFraction = Math.min(dayFraction, 0.5);
          } else if (endFraction === "second_half") {
            dayFraction = Math.min(dayFraction, 1.0);
          }
          // full_day stays as is
        }
      }

      if (dayFraction > 0) {
        totalDays += dayFraction;
      }

      breakdown.push({
        date: dateKey,
        fraction: dayFraction,
        isWorkingDay,
        isHoliday,
        holidayName: holiday?.name || null,
      });

      current.setDate(current.getDate() + 1);
    }

    // Round to 1 decimal place
    totalDays = Math.round(totalDays * 10) / 10;

    return { calculatedDays: totalDays, breakdown };
  }
}

export default new LeaveDayCalculator();