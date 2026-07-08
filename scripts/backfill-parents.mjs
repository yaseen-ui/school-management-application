import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function backfill() {
  const students = await prisma.student.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      tenantId: true,
      firstName: true,
      lastName: true,
      fatherName: true,
      fatherPhone: true,
      motherName: true,
      motherPhone: true,
      guardianName: true,
      guardianContact: true,
      guardianRelation: true,
    },
  });

  console.log(`Found ${students.length} students`);

  for (const s of students) {
    const parents = [];

    if (s.fatherName?.trim()) {
      parents.push({
        tenantId: s.tenantId,
        fullName: s.fatherName.trim(),
        phone: s.fatherPhone?.trim() || null,
        relation: "Father",
      });
    }

    if (s.motherName?.trim()) {
      parents.push({
        tenantId: s.tenantId,
        fullName: s.motherName.trim(),
        phone: s.motherPhone?.trim() || null,
        relation: "Mother",
      });
    }

    if (s.guardianName?.trim()) {
      parents.push({
        tenantId: s.tenantId,
        fullName: s.guardianName.trim(),
        phone: s.guardianContact?.trim() || null,
        relation: s.guardianRelation?.trim() || "Guardian",
      });
    }

    for (const p of parents) {
      // Find or create parent by name + tenantId
      const existing = await prisma.parent.findFirst({
        where: { tenantId: p.tenantId, fullName: p.fullName },
      });

      let parent = existing;
      if (!parent) {
        parent = await prisma.parent.create({ data: p });
        console.log(`  Created parent: ${p.fullName} (${p.relation})`);
      }

      // Check if link already exists
      const link = await prisma.studentParent.findFirst({
        where: { tenantId: s.tenantId, studentId: s.id, parentId: parent.id },
      });

      if (!link) {
        // Make father/mother primary if there's just one
        const isPrimary = p.relation === "Father" || (p.relation === "Mother" && parents.length === 1);
        await prisma.studentParent.create({
          data: {
            tenantId: s.tenantId,
            studentId: s.id,
            parentId: parent.id,
            isPrimary,
          },
        });
        console.log(`  Linked ${p.fullName} → ${s.firstName} ${s.lastName}`);
      }
    }
  }

  const parentCount = await prisma.parent.count();
  const linkCount = await prisma.studentParent.count();
  console.log(`\nDone. Parents: ${parentCount}, Links: ${linkCount}`);
  await prisma.$disconnect();
}

backfill().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});