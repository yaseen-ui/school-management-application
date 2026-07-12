import { prisma } from "../../lib/prisma.js";

/**
 * ID Sequence Service
 * 
 * Manages auto-incrementing ID patterns for admission numbers and employee codes.
 * Pattern format: "13091A{SEQ:4}" where {SEQ:4} means 4-digit zero-padded sequence.
 * Example: pattern = "13091A{SEQ:4}", currentSeq = 562 → generates "13091A0563"
 */

class IdSequenceService {
  /**
   * Generate the next ID value for the given entity type and academic year.
   * Atomically increments the sequence using a transaction to prevent duplicates.
   *
   * @param {string} tenantId
   * @param {string} entityType - "admission" | "employee_code"
   * @param {string|null} academicYearId
   * @param {string|null} entityId - Optional reference to the student/teacher
   * @returns {Promise<string>} The generated ID value (e.g., "13091A0563")
   */
  async generateNextId(tenantId, entityType, academicYearId, entityId = null) {
    // Find active pattern or use default
    const pattern = await this._findOrCreateDefaultPattern(tenantId, entityType, academicYearId);

    // Atomically increment the sequence using a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Lock & increment
      const updated = await tx.idSequencePattern.update({
        where: { id: pattern.id },
        data: { currentSeq: { increment: 1 } },
      });

      const newSeq = updated.currentSeq;
      const generatedValue = this._buildValue(updated.pattern, updated.seqLength, newSeq);

      // Log the generation
      await tx.idSequenceLog.create({
        data: {
          tenantId,
          patternId: pattern.id,
          generatedValue,
          entityType,
          entityId,
        },
      });

      return generatedValue;
    });

    return result;
  }

  /**
   * Preview the next ID without actually incrementing the sequence.
   */
  async previewNextId(tenantId, entityType, academicYearId) {
    const pattern = await prisma.idSequencePattern.findFirst({
      where: { tenantId, entityType, academicYearId, isActive: true },
    });

    if (!pattern) {
      return this._buildValue("{SEQ:4}", 4, 1); // default preview
    }

    const nextSeq = pattern.currentSeq + 1;
    return this._buildValue(pattern.pattern, pattern.seqLength, nextSeq);
  }

  /**
   * Build the generated ID from the pattern and sequence number.
   * @param {string} pattern - e.g., "13091A{SEQ:4}"
   * @param {number} seqLength - fallback if pattern has no explicit length
   * @param {number} seq - the sequence number
   * @returns {string}
   */
  _buildValue(pattern, seqLength, seq) {
    const match = pattern.match(/\{SEQ:(\d+)\}/);
    const len = match ? parseInt(match[1], 10) : (seqLength || 4);
    const padded = String(seq).padStart(len, '0');
    return pattern.replace(/{SEQ:\d+}/, padded);
  }

  /**
   * Extract sequence length from a pattern string.
   */
  _extractSeqLength(pattern) {
    const match = pattern.match(/\{SEQ:(\d+)\}/);
    return match ? parseInt(match[1], 10) : 4;
  }

  /**
   * Find existing pattern or create a default one.
   */
  async _findOrCreateDefaultPattern(tenantId, entityType, academicYearId) {
    let pattern = await prisma.idSequencePattern.findFirst({
      where: { tenantId, entityType, academicYearId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!pattern) {
      // Check if there's a pattern without academicYearId (global fallback)
      pattern = await prisma.idSequencePattern.findFirst({
        where: { tenantId, entityType, academicYearId: null, isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (!pattern) {
      // Create a default pattern
      const defaultPattern = entityType === 'admission' ? 'ADM{SEQ:4}' : 'EMP{SEQ:4}';
      pattern = await prisma.idSequencePattern.create({
        data: {
          tenantId,
          academicYearId,
          entityType,
          pattern: defaultPattern,
          seqLength: 4,
          currentSeq: 0,
          isActive: true,
        },
      });
    }

    return pattern;
  }

  /**
   * Create or update a sequence pattern.
   */
  async upsertPattern(tenantId, data, userId) {
    const { entityType, academicYearId, pattern, isActive } = data;
    
    const seqLength = this._extractSeqLength(pattern);
    
    // Check if a pattern already exists for this tenant + entityType + academicYearId
    const existing = await prisma.idSequencePattern.findFirst({
      where: { tenantId, entityType, academicYearId },
    });

    if (existing) {
      const updated = await prisma.idSequencePattern.update({
        where: { id: existing.id },
        data: {
          pattern,
          seqLength,
          isActive: isActive !== undefined ? isActive : existing.isActive,
          updatedById: userId,
        },
      });
      return updated;
    }

    const created = await prisma.idSequencePattern.create({
      data: {
        tenantId,
        academicYearId,
        entityType,
        pattern,
        seqLength,
        currentSeq: 0,
        isActive: isActive !== undefined ? isActive : true,
        createdById: userId,
      },
    });
    return created;
  }

  /**
   * Reset sequence counter (admin action).
   */
  async resetSequence(id, tenantId, newSeq = 0) {
    const updated = await prisma.idSequencePattern.update({
      where: { id, tenantId },
      data: { currentSeq: newSeq },
    });
    return updated;
  }

  /**
   * Update an existing pattern.
   */
  async updatePattern(id, tenantId, data) {
    const { pattern, isActive, academicYearId } = data;
    const updateData = {};
    if (pattern !== undefined) {
      updateData.pattern = pattern;
      updateData.seqLength = this._extractSeqLength(pattern);
    }
    if (isActive !== undefined) updateData.isActive = isActive;
    if (academicYearId !== undefined) updateData.academicYearId = academicYearId;

    const updated = await prisma.idSequencePattern.update({
      where: { id, tenantId },
      data: updateData,
      include: {
        academicYear: { select: { id: true, name: true } },
      },
    });
    return updated;
  }

  /**
   * Get all patterns for a tenant.
   */
  async getPatterns(tenantId, entityType = null) {
    const where = { tenantId };
    if (entityType) where.entityType = entityType;

    const patterns = await prisma.idSequencePattern.findMany({
      where,
      include: {
        academicYear: { select: { id: true, name: true } },
      },
      orderBy: [{ entityType: 'asc' }, { createdAt: 'desc' }],
    });

    return patterns.map((p) => ({
      ...p,
      nextPreview: p.isActive ? this._buildValue(p.pattern, p.seqLength, p.currentSeq + 1) : null,
    }));
  }

  /**
   * Get a single pattern by ID.
   */
  async getPatternById(id, tenantId) {
    const pattern = await prisma.idSequencePattern.findFirst({
      where: { id, tenantId },
      include: {
        academicYear: { select: { id: true, name: true } },
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!pattern) return null;

    return {
      ...pattern,
      nextPreview: pattern.isActive ? this._buildValue(pattern.pattern, pattern.seqLength, pattern.currentSeq + 1) : null,
    };
  }

  /**
   * Get generation logs for a tenant.
   */
  async getLogs(tenantId, { entityType = null, limit = 50 } = {}) {
    const where = { tenantId };
    if (entityType) where.entityType = entityType;

    const logs = await prisma.idSequenceLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return logs;
  }
}

export default new IdSequenceService();