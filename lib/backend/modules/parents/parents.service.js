import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

// Mapper for Parent output
function mapParentOut(row) {
  if (!row) return null;
  return {
    id: row.id,
    tenantId: row.tenantId,
    userId: row.userId,
    fullName: row.fullName,
    phone: row.phone,
    email: row.email,
    relation: row.relation,
    aadhaarNumber: row.aadhaarNumber,
    occupation: row.occupation,
    isRegistered: row.isRegistered,
    status: row.status,
    students: row.students
      ? row.students.map((sp) => ({
          id: sp.student.id,
          firstName: sp.student.firstName,
          lastName: sp.student.lastName,
          admissionNumber: sp.student.admissionNumber,
          gradeName: sp.student.grade?.gradeName,
          sectionName: sp.student.section?.sectionName,
          isPrimary: sp.isPrimary,
        }))
      : [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// Mapper for invite token response (public)
function mapInviteOut(row) {
  if (!row) return null;

  // Determine which mandatory fields are missing for registration
  const missingFields = [];
  if (!row.email) missingFields.push("email");
  if (!row.phone) missingFields.push("phone");

  return {
    fullName: row.fullName,
    phone: row.phone || "",
    email: row.email || "",
    relation: row.relation,
    missingFields,
  };
}

export default {
  // ─── Admin: Send invitation ────────────────────────────────────────────────
  async sendInvite(parentId, tenantId) {
    const parent = await prisma.parent.findUnique({
      where: { id: parentId, tenantId },
    });

    if (!parent) {
      throw new Error("Parent not found.");
    }

    if (parent.isRegistered) {
      throw new Error("Parent is already registered.");
    }

    // Generate a secure registration token (UUID)
    const crypto = await import("crypto");
    const token = crypto.randomUUID();

    // Token expires in 72 hours
    const tokenExp = new Date(Date.now() + 72 * 60 * 60 * 1000);

    await prisma.parent.update({
      where: { id: parentId, tenantId },
      data: {
        registrationToken: token,
        registrationTokenExp: tokenExp,
      },
    });

    // TODO: Integrate with SMS/email service to send the invite link
    // For now, just return the token so it can be shared manually
    return {
      parentId: parent.id,
      parentName: parent.fullName,
      phone: parent.phone,
      email: parent.email,
      token,
      tokenExpiresAt: tokenExp,
      inviteLink: `${process.env.APP_URL || "http://localhost:3000"}/parent-register?token=${token}`,
    };
  },

  // ─── Public: Validate invite token ──────────────────────────────────────────
  async validateInviteToken(token) {
    if (!token) {
      throw new Error("Token is required.");
    }

    const parent = await prisma.parent.findFirst({
      where: { registrationToken: token },
    });

    if (!parent) {
      throw new Error("Invalid or expired registration link.");
    }

    if (parent.isRegistered) {
      throw new Error("This parent has already registered.");
    }

    if (
      parent.registrationTokenExp &&
      new Date() > parent.registrationTokenExp
    ) {
      throw new Error("Registration link has expired. Please request a new one.");
    }

    return mapInviteOut(parent);
  },

  // ─── Public: Complete registration ──────────────────────────────────────────
  async registerParent({ token, email, phone, password }) {
    if (!token) {
      throw new Error("Registration token is required.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const parent = await prisma.parent.findFirst({
      where: { registrationToken: token },
    });

    if (!parent) {
      throw new Error("Invalid or expired registration link.");
    }

    if (parent.isRegistered) {
      throw new Error("This parent has already registered.");
    }

    if (
      parent.registrationTokenExp &&
      new Date() > parent.registrationTokenExp
    ) {
      throw new Error("Registration link has expired. Please request a new one.");
    }

    // Use provided email or fall back to the email on the parent record
    const userEmail = email || parent.email;
    if (!userEmail) {
      throw new Error("Email is required to complete registration.");
    }

    // Use provided phone or fall back to the one on the parent record
    const userPhone = phone || parent.phone;
    if (!userPhone) {
      throw new Error("Phone number is required to complete registration.");
    }

    // Check if a user with this email already exists for this tenant
    const existingUser = await prisma.user.findFirst({
      where: {
        tenantId: parent.tenantId,
        email: userEmail,
      },
    });

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user and link to parent in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          tenantId: parent.tenantId,
          fullName: parent.fullName,
          email: userEmail,
          phone: userPhone,
          password: hashedPassword,
          isFirstLogin: false,
        },
      });

      // Also update the parent record with any newly provided details
      const parentUpdateData = {
        userId: user.id,
        isRegistered: true,
        registrationToken: null,
        registrationTokenExp: null,
      };
      if (email && !parent.email) {
        parentUpdateData.email = email;
      }
      if (phone && !parent.phone) {
        parentUpdateData.phone = phone;
      }

      const updatedParent = await tx.parent.update({
        where: { id: parent.id, tenantId: parent.tenantId },
        data: parentUpdateData,
        include: {
          students: {
            include: {
              student: {
                include: {
                  grade: true,
                  section: true,
                },
              },
            },
          },
        },
      });

      return { user, parent: updatedParent };
    });

    return {
      message: "Registration successful. Please sign in with your email and password.",
      email: userEmail,
      parent: mapParentOut(result.parent),
    };
  },

  // ─── Parent: Get own profile (by userId) with children ─────────────────────
  async getMyProfile(userId, tenantId) {
    const parent = await prisma.parent.findFirst({
      where: { userId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                grade: true,
                section: true,
              },
            },
          },
        },
      },
    });

    return mapParentOut(parent);
  },

  // ─── Parent: Get store orders for own children ──────────────────────────
  async getMyChildrenStoreOrders(userId, tenantId) {
    const parent = await prisma.parent.findFirst({
      where: { userId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: { tenantId, deletedAt: null },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    })

    if (!parent || !parent.students?.length) return []

    const enrollmentIds = parent.students.flatMap((sp) =>
      sp.student.enrollments.map((e) => e.id)
    )

    const orders = await prisma.storeOrder.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollmentIds },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, imageUrl: true } },
          },
        },
        dues: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return orders.map((order) => {
      const parentStudent = parent.students.find((sp) =>
        sp.student.enrollments.some((e) => e.id === order.enrollmentId)
      )

      return {
        id: order.id,
        studentId: parentStudent?.student?.id,
        studentName: parentStudent?.student
          ? `${parentStudent.student.firstName} ${parentStudent.student.lastName}`
          : "",
        gradeName: parentStudent?.student?.grade?.gradeName,
        sectionName: parentStudent?.student?.section?.sectionName,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: Number(order.totalAmount),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        dueAmount: order.dues
          ? order.dues.reduce((sum, d) => sum + Number(d.dueAmount), 0) -
            (order.dues.reduce((sum, d) => sum + Number(d.paidAmount), 0) || 0)
          : 0,
        items: order.items.map((item) => ({
          productName: item.product?.name || item.productName || "Unknown",
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          totalPrice: Number(item.totalPrice),
          status: item.status,
        })),
        createdAt: order.createdAt,
      }
    })
  },

  // ─── Parent: Get leave requests for own children ─────────────────────────
  async getMyChildrenLeave(userId, tenantId) {
    const parent = await prisma.parent.findFirst({
      where: { userId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
    })

    if (!parent || !parent.students?.length) return []

    const studentIds = parent.students.map((sp) => sp.student.id)

    const requests = await prisma.leaveRequest.findMany({
      where: {
        tenantId,
        studentId: { in: studentIds },
        applicantType: "student",
      },
      include: {
        leaveCategory: { select: { id: true, name: true } },
        student: { select: { id: true, firstName: true, lastName: true } },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            grade: { select: { gradeName: true } },
            section: { select: { sectionName: true } },
          },
        },
        approvals: {
          orderBy: { level: "asc" },
          select: { id: true, status: true, level: true, remarks: true, decidedAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return requests.map((r) => ({
      id: r.id,
      studentId: r.studentId,
      studentName: r.student ? `${r.student.firstName} ${r.student.lastName}` : "",
      gradeName: r.enrollment?.grade?.gradeName,
      sectionName: r.enrollment?.section?.sectionName,
      leaveCategoryName: r.leaveCategory?.name || "Unknown",
      startDate: r.startDate.toISOString().split("T")[0],
      endDate: r.endDate.toISOString().split("T")[0],
      startFraction: r.startFraction,
      endFraction: r.endFraction,
      reason: r.reason,
      status: r.status,
      calculatedDays: r.calculatedDays,
      approvals: r.approvals,
      createdAt: r.createdAt,
    }))
  },

  // ─── Parent: Submit leave request for a child ────────────────────────────
  async submitLeaveForChild(userId, tenantId, data) {
    const { studentId, leaveCategoryId, startDate, endDate, startFraction, endFraction, reason } = data || {}

    if (!studentId || !leaveCategoryId || !startDate || !endDate || !reason) {
      throw new Error("Missing required fields: studentId, leaveCategoryId, startDate, endDate, reason")
    }

    // Verify parent is linked to this student
    const link = await prisma.parentStudent.findFirst({
      where: {
        tenantId,
        studentId,
        parent: { userId, deletedAt: null },
      },
      include: {
        student: {
          include: {
            enrollments: {
              where: { tenantId, deletedAt: null, status: "active" },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    })

    if (!link) {
      throw new Error("You are not authorized to submit leave for this student.")
    }

    const enrollmentId = link.student.enrollments[0]?.id || null

    // Use the existing leave service to create the request
    const LeaveService = (await import("../leave/leave.service.js")).default

    const request = await LeaveService.createRequest({
      tenantId,
      applicantType: "student",
      studentId,
      enrollmentId,
      leaveCategoryId,
      startDate,
      endDate,
      startFraction: startFraction || "full_day",
      endFraction: endFraction || "full_day",
      reason,
      // Submit directly as pending (not draft)
      status: "pending",
    }, tenantId)

    // Auto-submit the request
    if (request.status === "pending") {
      await LeaveService.submitRequest(request.id, tenantId)
    }

    return { id: request.id, status: request.status, message: "Leave request submitted successfully." }
  },

  // ─── Parent: Get fee details for own children ─────────────────────────────
  async getMyChildrenFees(userId, tenantId) {
    const parent = await prisma.parent.findFirst({
      where: { userId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: { tenantId, deletedAt: null },
                  select: { id: true, sectionId: true },
                },
                grade: true,
                section: true,
              },
            },
          },
        },
      },
    })

    if (!parent || !parent.students?.length) return []

    const enrollmentIds = parent.students.flatMap((sp) =>
      sp.student.enrollments.map((e) => e.id)
    )

    // Fetch student fees with payments
    const studentFees = await prisma.studentFee.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollmentIds },
      },
      include: {
        feeHeads: {
          include: { feeHead: { select: { id: true, name: true } } },
        },
        payments: {
          include: {
            feeHead: { select: { id: true, name: true } },
            term: { select: { id: true, name: true, dueDate: true } },
            refunds: true,
          },
          orderBy: { paymentDate: "desc" },
        },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            student: { select: { id: true, firstName: true, lastName: true } },
            section: {
              select: {
                id: true,
                sectionName: true,
                sectionFees: {
                  include: {
                    terms: {
                      select: { id: true, name: true, dueDate: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })

    // Map to child-level fee summary
    return parent.students.map((sp) => {
      const studentEnrollmentIds = sp.student.enrollments.map((e) => e.id)
      const feeRecord = studentFees.find((sf) => studentEnrollmentIds.includes(sf.enrollmentId))

      if (!feeRecord) {
        return {
          studentId: sp.student.id,
          studentName: `${sp.student.firstName} ${sp.student.lastName}`,
          gradeName: sp.student.grade?.gradeName,
          sectionName: sp.student.section?.sectionName,
          totalNegotiatedFee: 0,
          totalActualFee: 0,
          totalPaid: 0,
          totalRefunded: 0,
          balance: 0,
          nextDueDate: null,
          feeHeads: [],
          payments: [],
          isEmpty: true,
        }
      }

      const totalPaid = feeRecord.payments.reduce((sum, p) => sum + Number(p.amountPaid), 0)
      const totalRefunded = feeRecord.payments.reduce(
        (sum, p) =>
          sum + (p.refunds?.reduce((rs, r) => rs + Number(r.amount), 0) || 0),
        0
      )
      const totalNegotiated = Number(feeRecord.totalNegotiatedFee)

      // Find next due date from section fees
      let nextDueDate = null
      const sectionFees = feeRecord.enrollment?.section?.sectionFees
      if (sectionFees) {
        const now = new Date()
        for (const sf of sectionFees) {
          for (const term of sf.terms || []) {
            const dueDate = new Date(term.dueDate)
            if (dueDate >= now && (!nextDueDate || dueDate < new Date(nextDueDate))) {
              nextDueDate = term.dueDate
            }
          }
        }
      }

      return {
        studentId: sp.student.id,
        studentName: `${sp.student.firstName} ${sp.student.lastName}`,
        gradeName: sp.student.grade?.gradeName,
        sectionName: sp.student.section?.sectionName,
        rollNumber: feeRecord.enrollment?.rollNumber || "",
        totalNegotiatedFee: totalNegotiated,
        totalActualFee: Number(feeRecord.totalActualFee),
        totalPaid,
        totalRefunded,
        balance: totalNegotiated - totalPaid + totalRefunded,
        nextDueDate,
        feeHeads: feeRecord.feeHeads.map((h) => ({
          feeHeadId: h.feeHeadId,
          feeHeadName: h.feeHead?.name || "Unknown",
          actualAmount: Number(h.actualAmount),
          negotiatedAmount: Number(h.negotiatedAmount),
        })),
        payments: feeRecord.payments.map((p) => ({
          id: p.id,
          amountPaid: Number(p.amountPaid),
          paymentDate: p.paymentDate.toISOString().split("T")[0],
          paymentMethod: p.paymentMethod,
          status: p.status,
          transactionId: p.transactionId,
          feeHeadName: p.feeHead?.name || null,
          termName: p.term?.name || null,
          refunds: (p.refunds || []).map((r) => ({
            amount: Number(r.amount),
            reason: r.reason,
            refundDate: r.refundDate.toISOString().split("T")[0],
          })),
        })),
        isEmpty: false,
      }
    })
  },

  // ─── Parent: Get exam results for own children ─────────────────────────────
  async getMyChildrenResults(userId, tenantId, { examId }) {
    // Get parent with their linked students (enrollments)
    const parent = await prisma.parent.findFirst({
      where: { userId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: { tenantId, deletedAt: null },
                  select: { id: true, sectionId: true },
                },
                grade: true,
                section: true,
              },
            },
          },
        },
      },
    })

    if (!parent || !parent.students?.length) return []

    const enrollmentIds = parent.students.flatMap((sp) =>
      sp.student.enrollments.map((e) => e.id)
    )

    // Fetch marks with exam/schedule/paper info
    const marksWhere = {
      tenantId,
      enrollmentId: { in: enrollmentIds },
    }

    const marks = await prisma.examMark.findMany({
      where: marksWhere,
      include: {
        examPaper: {
          include: {
            schedule: {
              select: {
                id: true,
                name: true,
                sectionId: true,
                exam: { select: { id: true, name: true, examType: true } },
              },
            },
            sectionSubject: {
              include: {
                subject: { select: { id: true, subjectName: true } },
              },
            },
          },
        },
        enrollment: {
          select: {
            id: true,
            rollNumber: true,
            sectionId: true,
            student: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Filter by examId if provided
    const filteredMarks = examId
      ? marks.filter((m) => m.examPaper?.schedule?.exam?.id === examId)
      : marks

    // Group marks by exam → schedule → student
    const examMap = new Map()

    for (const mark of filteredMarks) {
      const schedule = mark.examPaper?.schedule
      const exam = schedule?.exam
      if (!exam) continue

      const examKey = exam.id
      if (!examMap.has(examKey)) {
        examMap.set(examKey, {
          examId: exam.id,
          examName: exam.name,
          examType: exam.examType,
          schedules: new Map(),
        })
      }

      const examEntry = examMap.get(examKey)
      const scheduleKey = schedule.id
      if (!examEntry.schedules.has(scheduleKey)) {
        examEntry.schedules.set(scheduleKey, {
          scheduleId: schedule.id,
          scheduleName: schedule.name,
          students: new Map(),
        })
      }

      const scheduleEntry = examEntry.schedules.get(scheduleKey)
      const enrollmentId = mark.enrollmentId
      if (!scheduleEntry.students.has(enrollmentId)) {
        scheduleEntry.students.set(enrollmentId, {
          enrollmentId,
          studentId: mark.enrollment?.student?.id,
          studentName: mark.enrollment?.student
            ? `${mark.enrollment.student.firstName} ${mark.enrollment.student.lastName}`
            : "",
          rollNumber: mark.enrollment?.rollNumber || "",
          subjects: [],
          totalMarks: 0,
          totalMaxMarks: 0,
        })
      }

      const studentEntry = scheduleEntry.students.get(enrollmentId)
      studentEntry.subjects.push({
        subjectName: mark.examPaper?.sectionSubject?.subject?.subjectName || "Unknown",
        maxMarks: mark.examPaper?.maxMarks || 100,
        passMarks: mark.examPaper?.passMarks || 35,
        marksObtained: mark.marksObtained,
        isAbsent: mark.isAbsent,
        gradeLabel: mark.gradeLabel,
      })

      if (mark.marksObtained !== null && !mark.isAbsent) {
        studentEntry.totalMarks += mark.marksObtained
        studentEntry.totalMaxMarks += mark.examPaper?.maxMarks || 0
      }
    }

    // Convert Map to clean array structure
    const result = []
    for (const [, examEntry] of examMap) {
      const examResult = {
        examId: examEntry.examId,
        examName: examEntry.examName,
        examType: examEntry.examType,
        children: [],
      }

      for (const [, scheduleEntry] of examEntry.schedules) {
        for (const [, studentEntry] of scheduleEntry.students) {
          // Find the matching parent-student link for grade/section info
          const parentStudent = parent.students.find(
            (sp) => sp.student.enrollments.some((e) => e.id === studentEntry.enrollmentId)
          )

          const percentage =
            studentEntry.totalMaxMarks > 0
              ? Math.round((studentEntry.totalMarks / studentEntry.totalMaxMarks) * 100 * 100) / 100
              : null

          // Assign grade label based on percentage
          let gradeLabel = ""
          if (percentage !== null) {
            if (percentage >= 90) gradeLabel = "A+"
            else if (percentage >= 80) gradeLabel = "A"
            else if (percentage >= 70) gradeLabel = "B+"
            else if (percentage >= 60) gradeLabel = "B"
            else if (percentage >= 50) gradeLabel = "C"
            else if (percentage >= 35) gradeLabel = "D"
            else gradeLabel = "F"
          }

          examResult.children.push({
            studentId: parentStudent?.student?.id || studentEntry.studentId,
            studentName: studentEntry.studentName,
            gradeName: parentStudent?.student?.grade?.gradeName,
            sectionName: parentStudent?.student?.section?.sectionName,
            rollNumber: studentEntry.rollNumber,
            scheduleId: scheduleEntry.scheduleId,
            scheduleName: scheduleEntry.scheduleName,
            subjects: studentEntry.subjects,
            totalMarks: studentEntry.totalMarks,
            totalMaxMarks: studentEntry.totalMaxMarks,
            percentage,
            gradeLabel,
            isPassed: percentage !== null ? percentage >= 35 : null,
          })
        }
      }

      if (examResult.children.length > 0) {
        result.push(examResult)
      }
    }

    return result
  },

  // ─── Parent: Get attendance for own children ─────────────────────────────
  async getMyChildrenAttendance(userId, tenantId, { month, year }) {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // Get parent with their linked students (enrollments)
    const parent = await prisma.parent.findFirst({
      where: { userId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                enrollments: {
                  where: { tenantId, deletedAt: null },
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    })

    if (!parent || !parent.students?.length) return []

    const enrollmentIds = parent.students.flatMap((sp) =>
      sp.student.enrollments.map((e) => e.id)
    )

    const records = await prisma.attendanceRecord.findMany({
      where: {
        tenantId,
        enrollmentId: { in: enrollmentIds },
        date: { gte: startDate, lte: endDate },
      },
      select: {
        id: true,
        date: true,
        enrollmentId: true,
        status: true,
      },
      orderBy: { date: "asc" },
    })

    // Group by student for frontend
    return parent.students.map((sp) => ({
      studentId: sp.student.id,
      studentName: `${sp.student.firstName} ${sp.student.lastName}`,
      gradeName: sp.student.grade?.gradeName,
      sectionName: sp.student.section?.sectionName,
      records: records
        .filter((r) => sp.student.enrollments.some((e) => e.id === r.enrollmentId))
        .map((r) => ({
          date: r.date.toISOString().split("T")[0],
          status: r.status,
        })),
      summary: {
        present: 0,
        absent: 0,
        late: 0,
      },
    })).map((child) => {
      child.records.forEach((r) => {
        if (r.status === "present") child.summary.present++
        else if (r.status === "absent") child.summary.absent++
        else if (r.status === "late") child.summary.late++
      })
      return child
    })
  },

  // ─── Admin: Get all parents (with registration status) ──────────────────────
  async getAllParents(tenantId) {
    const parents = await prisma.parent.findMany({
      where: { tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                grade: true,
                section: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return parents.map(mapParentOut);
  },

  // ─── Admin: Get single parent ───────────────────────────────────────────────
  async getParentById(parentId, tenantId) {
    const parent = await prisma.parent.findFirst({
      where: { id: parentId, tenantId, deletedAt: null },
      include: {
        students: {
          include: {
            student: {
              include: {
                grade: true,
                section: true,
              },
            },
          },
        },
      },
    });

    return mapParentOut(parent);
  },
};