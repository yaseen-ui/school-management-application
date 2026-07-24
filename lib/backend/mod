import { prisma } from "../../lib/prisma.js";
import logger from "../../utils/logger.js";

/**
 * TemplateService — CRUD operations for NotificationTemplates.
 *
 * Templates support {{placeholder}} syntax for variable substitution.
 * Used both for manual communications and automated (AutomationRule) messages.
 */
class TemplateService {
  /**
   * Create a new notification template.
   */
  async create(data, tenantId, userId) {
    const template = await prisma.notificationTemplate.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description || null,
        type: data.type,
        subject: data.subject,
        body: data.body,
        defaultChannel: data.defaultChannel || "in_app",
        defaultPriority: data.defaultPriority || 0,
        isSystem: data.isSystem || false,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdById: userId,
      },
    });

    logger.info(`Notification template created: ${template.id} (${template.name})`);
    return template;
  }

  /**
   * Get a single template by ID.
   */
  async getById(id, tenantId) {
    const template = await prisma.notificationTemplate.findFirst({
      where: { id, tenantId },
      include: {
        automationRules: {
          select: { id: true, name: true, sourceModule: true, event: true, isEnabled: true },
        },
      },
    });

    if (!template) {
      throw new Error("Template not found.");
    }

    return template;
  }

  /**
   * List templates with optional filters.
   */
  async list({ tenantId, type, isActive, isSystem, limit = 50, offset = 0 }) {
    const where = { tenantId };
    if (type) where.type = type;
    if (isActive !== undefined) where.isActive = isActive;
    if (isSystem !== undefined) where.isSystem = isSystem;

    const [items, total] = await Promise.all([
      prisma.notificationTemplate.findMany({
        where,
        include: {
          _count: { select: { automationRules: true } },
        },
        orderBy: { name: "asc" },
        take: limit,
        skip: offset,
      }),
      prisma.notificationTemplate.count({ where }),
    ]);

    return { items, total, limit, offset };
  }

  /**
   * Update a template.
   */
  async update(id, data, tenantId, userId) {
    const existing = await prisma.notificationTemplate.findFirst({
      where: { id, tenantId },
    });

    if (!existing) {
      throw new Error("Template not found.");
    }

    const template = await prisma.notificationTemplate.update({
      where: { id, tenantId },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        subject: data.subject,
        body: data.body,
        defaultChannel: data.defaultChannel,
        defaultPriority: data.defaultPriority,
        isSystem: data.isSystem,
        isActive: data.isActive,
        updatedById: userId,
      },
    });

    logger.info(`Notification template updated: ${template.id}`);
    return template;
  }

  /**
   * Delete a template that is not referenced by any automation rules.
   */
  async delete(id, tenantId) {
    const existing = await prisma.notificationTemplate.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { automationRules: true } } },
    });

    if (!existing) {
      throw new Error("Template not found.");
    }

    if (existing._count.automationRules > 0) {
      throw new Error(
        `Cannot delete template "${existing.name}" because it is used by ${existing._count.automationRules} automation rule(s). Please reassign those rules first.`
      );
    }

    await prisma.notificationTemplate.delete({ where: { id, tenantId } });
    logger.info(`Notification template deleted: ${id}`);
    return { deleted: true };
  }

  /**
   * Preview a template with given placeholder values.
   * Returns the rendered subject and body.
   */
  renderTemplate(template, payload = {}) {
    if (!template) return { subject: "", body: "" };

    const replacePlaceholders = (text) => {
      if (!text) return "";
      return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
        return payload[key] !== undefined ? String(payload[key]) : `{{${key}}}`;
      });
    };

    return {
      subject: replacePlaceholders(template.subject),
      body: replacePlaceholders(template.body),
    };
  }

  /**
   * Preview a template by ID with placeholder values.
   */
  async preview(id, payload, tenantId) {
    const template = await this.getById(id, tenantId);
    return this.renderTemplate(template, payload);
  }
}

// Singleton instance
const templateService = new TemplateService();
export default templateService;