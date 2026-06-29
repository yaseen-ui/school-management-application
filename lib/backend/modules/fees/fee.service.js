import { prisma } from "../../lib/prisma.js";

// ─── Fee Heads ───────────────────────────────────────────────────────────────

function mapFeeHeadIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.name !== undefined) out.name = data.name;
  if (data.description !== undefined) out.description = data.description || null;
  if (data.isOptional !== undefined) out.isOptional = data.isOptional ?? false;
  if (data.sortOrder !== undefined) out.sortOrder = data.sortOrder ?? 0;
  return out;
}

function mapFeeHeadOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    name: row.name,
    description: row.description,
    isOptional: row.isOptional,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    _count: row._count
      ? {
          sectionFeeHeads: row._count.sectionFeeHeads,
          studentFeeHeads: row._count.studentFeeHeads,
          payments: row._count.feePayments,
        }
      : null,
  };
}

async function createFeeHead(data, tenantId) {
  const payload = mapFeeHeadIn(data, tenantId);
  const feeHead = await prisma.feeHead.create({ data: payload });
  return mapFeeHeadOut(feeHead);
}

async function getFeeHeadById(id, tenantId) {
  const feeHead = await prisma.feeHead.findFirst({
    where: { id, tenantId },
    include: { _count: { select: { sectionFeeHeads: true, studentFeeHeads: true, feePayments: true } } },
  });
  return mapFeeHeadOut(feeHead);
}

async function getAllFeeHeads(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }
  const feeHeads = await prisma.feeHead.findMany({
    where,
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { sectionFeeHeads: true, studentFeeHeads: true, feePayments: true } } },
  });
  return feeHeads.map(mapFeeHeadOut);
}

async function updateFeeHead(id, data, tenantId) {
  const payload = mapFeeHeadIn(data, tenantId);
  const feeHead = await prisma.feeHead.update({
    where: { id, tenantId },
    data: payload,
  });
  return mapFeeHeadOut(feeHead);
}

async function deleteFeeHead(id, tenantId) {
  await prisma.feeHead.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Section Fees ────────────────────────────────────────────────────────────

function mapSectionFeeIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.sectionId !== undefined) out.sectionId = data.sectionId;
  if (data.academicYearId !== undefined) out.academicYearId = data.academicYearId;
  if (data.termCount !== undefined) out.termCount = data.termCount;
  if (data.heads !== undefined) {
    // heads is an array of { feeHeadId, amount }
    out.heads = data.heads;
  }
  return out;
}

function mapSectionFeeOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    sectionId: row.sectionId,
    academicYearId: row.academicYearId,
    termCount: row.termCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    section: row.section
      ? { id: row.section.id, sectionName: row.section.sectionName, grade: row.section.grade ? { id: row.section.grade.id, gradeName: row.section.grade.gradeName } : null }
      : null,
    academicYear: row.academicYear
      ? { id: row.academicYear.id, name: row.academicYear.name }
      : null,
    heads: row.feeHeads
      ? row.feeHeads.map((h) => ({
          id: h.id,
          feeHeadId: h.feeHeadId,
          amount: Number(h.amount),
          feeHead: h.feeHead ? { id: h.feeHead.id, name: h.feeHead.name } : null,
        }))
      : null,
    _count: row._count
      ? { feeHeads: row._count.feeHeads, terms: row._count.terms }
      : null,
  };
}

async function createSectionFee(data, tenantId) {
  const { heads, ...sectionFeeData } = mapSectionFeeIn(data, tenantId);

  const sectionFee = await prisma.sectionFee.create({
    data: {
      ...sectionFeeData,
      feeHeads: heads
        ? {
            create: heads.map((h) => ({
              feeHeadId: h.feeHeadId,
              amount: h.amount,
            })),
          }
        : undefined,
    },
    include: {
      section: { include: { grade: true } },
      academicYear: true,
      feeHeads: { include: { feeHead: true } },
      _count: { select: { feeHeads: true, terms: true } },
    },
  });
  return mapSectionFeeOut(sectionFee);
}

async function getSectionFeeById(id, tenantId) {
  const sectionFee = await prisma.sectionFee.findFirst({
    where: { id, tenantId },
    include: {
      section: { include: { grade: true } },
      academicYear: true,
      feeHeads: { include: { feeHead: true } },
      _count: { select: { feeHeads: true, terms: true } },
    },
  });
  return mapSectionFeeOut(sectionFee);
}

async function getAllSectionFees(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.sectionId) where.sectionId = filters.sectionId;
  if (filters.academicYearId) where.academicYearId = filters.academicYearId;

  const sectionFees = await prisma.sectionFee.findMany({
    where,
    include: {
      section: { include: { grade: true } },
      academicYear: true,
      feeHeads: { include: { feeHead: true } },
      _count: { select: { feeHeads: true, terms: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return sectionFees.map(mapSectionFeeOut);
}

async function updateSectionFee(id, data, tenantId) {
  const { heads, ...sectionFeeData } = mapSectionFeeIn(data, tenantId);

  // If heads are provided, delete existing and recreate
  if (heads) {
    await prisma.sectionFeeHead.deleteMany({ where: { sectionFeeId: id } });
  }

  const sectionFee = await prisma.sectionFee.update({
    where: { id, tenantId },
    data: {
      ...sectionFeeData,
      feeHeads: heads
        ? {
            create: heads.map((h) => ({
              feeHeadId: h.feeHeadId,
              amount: h.amount,
            })),
          }
        : undefined,
    },
    include: {
      section: { include: { grade: true } },
      academicYear: true,
      feeHeads: { include: { feeHead: true } },
      _count: { select: { feeHeads: true, terms: true } },
    },
  });
  return mapSectionFeeOut(sectionFee);
}

async function deleteSectionFee(id, tenantId) {
  await prisma.sectionFeeHead.deleteMany({ where: { sectionFeeId: id } });
  await prisma.sectionFee.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Fee Terms ───────────────────────────────────────────────────────────────

function mapFeeTermIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.sectionFeeId !== undefined) out.sectionFeeId = data.sectionFeeId;
  if (data.name !== undefined) out.name = data.name;
  if (data.dueDate !== undefined) out.dueDate = new Date(data.dueDate);
  if (data.sortOrder !== undefined) out.sortOrder = data.sortOrder ?? 0;
  return out;
}

function mapFeeTermOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    sectionFeeId: row.sectionFeeId,
    name: row.name,
    dueDate: row.dueDate,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    sectionFee: row.sectionFee
      ? {
          id: row.sectionFee.id,
          termCount: row.sectionFee.termCount,
          section: row.sectionFee.section ? { id: row.sectionFee.section.id, sectionName: row.sectionFee.section.sectionName } : null,
          academicYear: row.sectionFee.academicYear ? { id: row.sectionFee.academicYear.id, name: row.sectionFee.academicYear.name } : null,
        }
      : null,
    _count: row._count ? { payments: row._count.payments } : null,
  };
}

async function createFeeTerm(data, tenantId) {
  const payload = mapFeeTermIn(data, tenantId);
  const term = await prisma.feeTerm.create({ data: payload });
  return mapFeeTermOut(term);
}

async function getFeeTermById(id, tenantId) {
  const term = await prisma.feeTerm.findFirst({
    where: { id, tenantId },
    include: {
      sectionFee: { include: { section: true, academicYear: true } },
      _count: { select: { payments: true } },
    },
  });
  return mapFeeTermOut(term);
}

async function getAllFeeTerms(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.sectionFeeId) where.sectionFeeId = filters.sectionFeeId;

  const terms = await prisma.feeTerm.findMany({
    where,
    include: {
      sectionFee: { include: { section: true, academicYear: true } },
      _count: { select: { payments: true } },
    },
    orderBy: { sortOrder: "asc" },
  });
  return terms.map(mapFeeTermOut);
}

async function updateFeeTerm(id, data, tenantId) {
  const payload = mapFeeTermIn(data, tenantId);
  const term = await prisma.feeTerm.update({
    where: { id, tenantId },
    data: payload,
  });
  return mapFeeTermOut(term);
}

async function deleteFeeTerm(id, tenantId) {
  await prisma.feeTerm.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Student Fees ────────────────────────────────────────────────────────────

function mapStudentFeeIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.enrollmentId !== undefined) out.enrollmentId = data.enrollmentId;
  if (data.totalActualFee !== undefined) out.totalActualFee = data.totalActualFee;
  if (data.totalNegotiatedFee !== undefined) out.totalNegotiatedFee = data.totalNegotiatedFee;
  if (data.allocationMethod !== undefined) out.allocationMethod = data.allocationMethod || "equal";
  if (data.discountType !== undefined) out.discountType = data.discountType || null;
  if (data.discountValue !== undefined) out.discountValue = data.discountValue ?? 0;
  if (data.discountReason !== undefined) out.discountReason = data.discountReason || null;
  if (data.headWiseDiscounts !== undefined) out.headWiseDiscounts = data.headWiseDiscounts || null;
  if (data.heads !== undefined) {
    out.heads = data.heads; // array of { feeHeadId, actualAmount, negotiatedAmount }
  }
  return out;
}

function mapStudentFeeOut(row) {
  if (!row) return null;

  // Calculate total paid amount from payments
  const totalPaid = row.payments
    ? row.payments.reduce((sum, p) => sum + Number(p.amountPaid), 0)
    : 0;

  // Calculate total refunded amount from payment refunds
  const totalRefunded = row.payments
    ? row.payments.reduce((sum, p) => {
        if (p.refunds && p.refunds.length > 0) {
          return sum + p.refunds.reduce((rSum, r) => rSum + Number(r.amount), 0);
        }
        return sum;
      }, 0)
    : 0;

  // Find the next upcoming due date from fee terms (via section fee)
  let nextDueDate = null;

  if (row.enrollment?.section?.sectionFees) {
    const now = new Date();
    for (const sectionFee of row.enrollment.section.sectionFees) {
      if (sectionFee.terms) {
        for (const term of sectionFee.terms) {
          const dueDate = new Date(term.dueDate);
          if (dueDate >= now) {
            if (!nextDueDate || dueDate < new Date(nextDueDate)) {
              nextDueDate = term.dueDate;
            }
          }
        }
      }
    }
  }

  return {
    id: row.id,
    tenantId: row.tenantId,
    enrollmentId: row.enrollmentId,
    totalActualFee: Number(row.totalActualFee),
    totalNegotiatedFee: Number(row.totalNegotiatedFee),
    totalPaid,
    totalRefunded,
    balance: Number(row.totalNegotiatedFee) - totalPaid + totalRefunded,
    nextDueDate,

    allocationMethod: row.allocationMethod,
    discountType: row.discountType,
    discountValue: row.discountValue ? Number(row.discountValue) : 0,
    discountReason: row.discountReason,
    headWiseDiscounts: row.headWiseDiscounts,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    enrollment: row.enrollment
      ? {
          id: row.enrollment.id,
          rollNumber: row.enrollment.rollNumber,
          student: row.enrollment.student
            ? { id: row.enrollment.student.id, firstName: row.enrollment.student.firstName, lastName: row.enrollment.student.lastName }
            : null,
          section: row.enrollment.section
            ? { id: row.enrollment.section.id, sectionName: row.enrollment.section.sectionName }
            : null,
        }
      : null,
    heads: row.feeHeads
      ? row.feeHeads.map((h) => ({
          id: h.id,
          feeHeadId: h.feeHeadId,
          actualAmount: Number(h.actualAmount),
          negotiatedAmount: Number(h.negotiatedAmount),
          feeHead: h.feeHead ? { id: h.feeHead.id, name: h.feeHead.name } : null,
        }))
      : null,
    _count: row._count ? { payments: row._count.payments } : null,
  };
}

async function createStudentFee(data, tenantId) {
  const { heads, ...studentFeeData } = mapStudentFeeIn(data, tenantId);

  const studentFee = await prisma.studentFee.create({
    data: {
      ...studentFeeData,
      feeHeads: heads
        ? {
            create: heads.map((h) => ({
              feeHeadId: h.feeHeadId,
              actualAmount: h.actualAmount,
              negotiatedAmount: h.negotiatedAmount,
            })),
          }
        : undefined,
    },
    include: {
      enrollment: { include: { student: true, section: true } },
      feeHeads: { include: { feeHead: true } },
      _count: { select: { payments: true } },
    },
  });
  return mapStudentFeeOut(studentFee);
}

async function getStudentFeeById(id, tenantId) {
  const studentFee = await prisma.studentFee.findFirst({
    where: { id, tenantId },
    include: {
      enrollment: { include: { student: true, section: true } },
      feeHeads: { include: { feeHead: true } },
      _count: { select: { payments: true } },
    },
  });
  return mapStudentFeeOut(studentFee);
}

async function getAllStudentFees(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.enrollmentId) where.enrollmentId = filters.enrollmentId;
  if (filters.sectionId) where.enrollment = { sectionId: filters.sectionId };

  const studentFees = await prisma.studentFee.findMany({
    where,
    include: {
      enrollment: {
        include: {
          student: true,
          section: {
            include: {
              sectionFees: {
                include: {
                  terms: true,
                },
              },
            },
          },
        },
      },
      feeHeads: { include: { feeHead: true } },
      payments: {
        include: {
          refunds: true,
        },
      },

      _count: { select: { payments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return studentFees.map(mapStudentFeeOut);
}

async function updateStudentFee(id, data, tenantId) {
  const { heads, ...studentFeeData } = mapStudentFeeIn(data, tenantId);

  if (heads) {
    await prisma.studentFeeHead.deleteMany({ where: { studentFeeId: id } });
  }

  const studentFee = await prisma.studentFee.update({
    where: { id, tenantId },
    data: {
      ...studentFeeData,
      feeHeads: heads
        ? {
            create: heads.map((h) => ({
              feeHeadId: h.feeHeadId,
              actualAmount: h.actualAmount,
              negotiatedAmount: h.negotiatedAmount,
            })),
          }
        : undefined,
    },
    include: {
      enrollment: { include: { student: true, section: true } },
      feeHeads: { include: { feeHead: true } },
      _count: { select: { payments: true } },
    },
  });
  return mapStudentFeeOut(studentFee);
}

async function deleteStudentFee(id, tenantId) {
  await prisma.studentFeeHead.deleteMany({ where: { studentFeeId: id } });
  await prisma.studentFee.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Fee Payments ────────────────────────────────────────────────────────────

function mapPaymentIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.studentFeeId !== undefined) out.studentFeeId = data.studentFeeId;
  if (data.termId !== undefined) out.termId = data.termId || null;
  if (data.feeHeadId !== undefined) out.feeHeadId = data.feeHeadId || null;
  if (data.amountPaid !== undefined) out.amountPaid = data.amountPaid;
  if (data.paymentMethod !== undefined) out.paymentMethod = data.paymentMethod;
  if (data.transactionId !== undefined) out.transactionId = data.transactionId || null;
  if (data.status !== undefined) out.status = data.status || "paid";
  if (data.paymentDate !== undefined) out.paymentDate = new Date(data.paymentDate);
  if (data.remarks !== undefined) out.remarks = data.remarks || null;
  if (data.collectedById !== undefined) out.collectedById = data.collectedById || null;
  return out;
}

function mapPaymentOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    studentFeeId: row.studentFeeId,
    termId: row.termId,
    feeHeadId: row.feeHeadId,
    amountPaid: Number(row.amountPaid),
    paymentMethod: row.paymentMethod,
    transactionId: row.transactionId,
    status: row.status,
    paymentDate: row.paymentDate,
    remarks: row.remarks,
    collectedById: row.collectedById,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    studentFee: row.studentFee
      ? {
          id: row.studentFee.id,
          totalActualFee: Number(row.studentFee.totalActualFee),
          totalNegotiatedFee: Number(row.studentFee.totalNegotiatedFee),
          enrollment: row.studentFee.enrollment
            ? {
                id: row.studentFee.enrollment.id,
                rollNumber: row.studentFee.enrollment.rollNumber,
                student: row.studentFee.enrollment.student
                  ? { id: row.studentFee.enrollment.student.id, firstName: row.studentFee.enrollment.student.firstName, lastName: row.studentFee.enrollment.student.lastName }
                  : null,
              }
            : null,
        }
      : null,
    term: row.term
      ? { id: row.term.id, name: row.term.name, dueDate: row.term.dueDate, sortOrder: row.term.sortOrder }
      : null,
    feeHead: row.feeHead
      ? { id: row.feeHead.id, name: row.feeHead.name }
      : null,
    collectedBy: row.collectedBy
      ? { id: row.collectedBy.id, fullName: row.collectedBy.fullName }
      : null,
  };
}

async function createPayment(data, tenantId) {
  const payload = mapPaymentIn(data, tenantId);
  const payment = await prisma.feePayment.create({
    data: payload,
    include: {
      studentFee: { include: { enrollment: { include: { student: true } } } },
      term: true,
      feeHead: true,
      collectedBy: true,
    },
  });
  return mapPaymentOut(payment);
}

async function getPaymentById(id, tenantId) {
  const payment = await prisma.feePayment.findFirst({
    where: { id, tenantId },
    include: {
      studentFee: { include: { enrollment: { include: { student: true } } } },
      term: true,
      feeHead: true,
      collectedBy: true,
    },
  });
  return mapPaymentOut(payment);
}

async function getAllPayments(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.studentFeeId) where.studentFeeId = filters.studentFeeId;
  if (filters.termId) where.termId = filters.termId;
  if (filters.status) where.status = filters.status;
  if (filters.paymentMethod) where.paymentMethod = filters.paymentMethod;

  const payments = await prisma.feePayment.findMany({
    where,
    include: {
      studentFee: { include: { enrollment: { include: { student: true } } } },
      term: true,
      feeHead: true,
      collectedBy: true,
    },
    orderBy: { paymentDate: "desc" },
  });
  return payments.map(mapPaymentOut);
}

async function updatePayment(id, data, tenantId) {
  const payload = mapPaymentIn(data, tenantId);
  const payment = await prisma.feePayment.update({
    where: { id, tenantId },
    data: payload,
    include: {
      studentFee: { include: { enrollment: { include: { student: true } } } },
      term: true,
      feeHead: true,
      collectedBy: true,
    },
  });
  return mapPaymentOut(payment);
}

async function deletePayment(id, tenantId) {
  await prisma.feePayment.delete({ where: { id, tenantId } });
  return { id };
}

// ─── Fee Refunds ─────────────────────────────────────────────────────────────

function mapRefundIn(data = {}, tenantId) {
  const out = { tenantId };
  if (data.paymentId !== undefined) out.paymentId = data.paymentId;
  if (data.amount !== undefined) out.amount = data.amount;
  if (data.reason !== undefined) out.reason = data.reason;
  if (data.refundDate !== undefined) out.refundDate = new Date(data.refundDate);
  if (data.processedById !== undefined) out.processedById = data.processedById || null;
  return out;
}

function mapRefundOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    paymentId: row.paymentId,
    amount: Number(row.amount),
    reason: row.reason,
    refundDate: row.refundDate,
    processedById: row.processedById,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    payment: row.payment
      ? {
          id: row.payment.id,
          amountPaid: Number(row.payment.amountPaid),
          paymentMethod: row.payment.paymentMethod,
          transactionId: row.payment.transactionId,
          studentFee: row.payment.studentFee
            ? {
                id: row.payment.studentFee.id,
                enrollment: row.payment.studentFee.enrollment
                  ? {
                      id: row.payment.studentFee.enrollment.id,
                      student: row.payment.studentFee.enrollment.student
                        ? { id: row.payment.studentFee.enrollment.student.id, firstName: row.payment.studentFee.enrollment.student.firstName, lastName: row.payment.studentFee.enrollment.student.lastName }
                        : null,
                    }
                  : null,
              }
            : null,
        }
      : null,
    processedBy: row.processedBy
      ? { id: row.processedBy.id, fullName: row.processedBy.fullName }
      : null,
  };
}

async function createRefund(data, tenantId) {
  const payload = mapRefundIn(data, tenantId);
  const refund = await prisma.feeRefund.create({
    data: payload,
    include: {
      payment: { include: { studentFee: { include: { enrollment: { include: { student: true } } } } } },
      processedBy: true,
    },
  });
  return mapRefundOut(refund);
}

async function getAllRefunds(tenantId, filters = {}) {
  const where = { tenantId };
  if (filters.paymentId) where.paymentId = filters.paymentId;

  const refunds = await prisma.feeRefund.findMany({
    where,
    include: {
      payment: { include: { studentFee: { include: { enrollment: { include: { student: true } } } } } },
      processedBy: true,
    },
    orderBy: { refundDate: "desc" },
  });
  return refunds.map(mapRefundOut);
}

// ─── Dashboard / Summary ─────────────────────────────────────────────────────

async function getFeeSummary(tenantId, filters = {}) {
  const where = { tenantId };

  const totalCollected = await prisma.feePayment.aggregate({
    where: { ...where, status: { in: ["paid", "partial"] } },
    _sum: { amountPaid: true },
  });

  const totalRefunded = await prisma.feeRefund.aggregate({
    where,
    _sum: { amount: true },
  });

  const totalNegotiated = await prisma.studentFee.aggregate({
    where,
    _sum: { totalNegotiatedFee: true },
  });

  const totalActual = await prisma.studentFee.aggregate({
    where,
    _sum: { totalActualFee: true },
  });

  const pendingPayments = await prisma.feePayment.count({
    where: { ...where, status: "pending" },
  });

  const totalPayments = await prisma.feePayment.count({
    where,
  });

  return {
    totalCollected: totalCollected._sum.amountPaid || 0,
    totalRefunded: totalRefunded._sum.amount || 0,
    totalNegotiatedFee: totalNegotiated._sum.totalNegotiatedFee || 0,
    totalActualFee: totalActual._sum.totalActualFee || 0,
    pendingPayments,
    totalPayments,
  };
}

export default {
  // Fee Heads
  createFeeHead,
  getFeeHeadById,
  getAllFeeHeads,
  updateFeeHead,
  deleteFeeHead,

  // Section Fees
  createSectionFee,
  getSectionFeeById,
  getAllSectionFees,
  updateSectionFee,
  deleteSectionFee,

  // Fee Terms
  createFeeTerm,
  getFeeTermById,
  getAllFeeTerms,
  updateFeeTerm,
  deleteFeeTerm,

  // Student Fees
  createStudentFee,
  getStudentFeeById,
  getAllStudentFees,
  updateStudentFee,
  deleteStudentFee,

  // Payments
  createPayment,
  getPaymentById,
  getAllPayments,
  updatePayment,
  deletePayment,

  // Refunds
  createRefund,
  getAllRefunds,

  // Summary
  getFeeSummary,
};
