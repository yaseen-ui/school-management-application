import { prisma } from "../../lib/prisma.js";
import { communicationService } from "./communication.service.js";

/**
 * AutomationEngine — Listens for events from other modules and triggers communications
 * based on configured AutomationRules.
 *
 * Usage from other services:
 *   import { automationEngine } from "../communication/automation.service.js";
 *   await automationEngine.handleEvent({ module, event, payload, tenantId });
 */
export class AutomationEngine {
  /**
   * Handle an event fired by another module.
   * Looks up matching AutomationRules, builds the message from the template,
   * and dispatches through CommunicationService.send().
   *
   * @param {Object} params
   * @param {string} params.module   — e.g., "attendance", "leave", "exam"
   * @param {string} params.event    — e.g., "student_absent", "leave_approved"
   * @param {Object} params.payload  — event-specific data
   * @param {string} params.tenantId
   */
  async handleEvent({ module, event, payload, tenantId }) {
    // Find the matching automation rule
    const rule = await prisma.automationRule.findFirst({
      where: {
        tenantId,
        sourceModule: module,
        event,
        isEnabled: true,
      },
      include: { template: true },
    });

    if (!rule) {
      // No rule configured for this event — silent no-op
      return { fired: false, reason: "No matching rule" };
    }

    // Build message from template with placeholder substitution
    const subject = this.#renderTemplate(rule.template.subject, payload);
    const body = this.#renderTemplate(rule.template.body, payload);

    // Send through the central pipeline
    const result = await communicationService.send(
      {
        type: rule.template.type,
        senderType: "system",
        title: subject,
        message: body,
        channels: rule.channels,
        automationRuleId: rule.id,
        sourceModule: module,
        sourceEvent: event,
        sourceReference: {
          entityType: payload.entityType || module,
          entityId: payload.entityId || null,
        },
        audience: this.#buildAudience(payload),
      },
      tenantId,
      null // system actor
    );

    return { fired: true, ruleId: rule.id, ...result };
  }

  /**
   * Simple placeholder substitution: {{variableName}}
   */
  #renderTemplate(template, payload) {
    if (!template) return "";
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return payload[key] !== undefined ? payload[key] : `{{${key}}}`;
    });
  }

  /**
   * Build audience criteria from event payload.
   * Each event handler in Phase 4 will customize this based on the event type.
   * For now, resolves based on payload audience hints.
   */
  #buildAudience(payload) {
    const audience = {};

    // If the event provides explicit audience, use it
    if (payload.audience) {
      return payload.audience;
    }

    // Common resolution patterns based on what's in the payload
    if (payload.parentUserId) {
      audience.targetUserIds = [{ userId: payload.parentUserId }];
    } else if (payload.approverId) {
      audience.targetUserIds = [{ userId: payload.approverId }];
    } else if (payload.userId) {
      audience.targetUserIds = [{ userId: payload.userId }];
    }

    // Grade/section scoping for student-related events
    if (payload.gradeId) {
      audience.targetGrades = [{ gradeId: payload.gradeId }];
    }
    if (payload.sectionId) {
      audience.targetSections = [{ sectionId: payload.sectionId }];
    }

    // If nothing specific, default to parent audience for student events
    if (Object.keys(audience).length === 0) {
      audience.targetAudience = ["parent", "employee"];
    }

    return Object.keys(audience).length > 0 ? audience : null;
  }
}

// Singleton instance
export const automationEngine = new AutomationEngine();