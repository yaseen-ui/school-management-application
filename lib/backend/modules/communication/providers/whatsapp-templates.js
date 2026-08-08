/**
 * WhatsApp template registry — maps app events / template keys to Meta Cloud API templates.
 *
 * IMPORTANT: Template *names* and *body parameter counts* must match templates approved in Meta.
 * Submit the bodies below in Meta Business Manager before enabling live sends.
 *
 * App-side placeholders use {{name}}; Meta uses ordered {{1}}, {{2}}, ...
 */

const MAX_PARAM_LEN = 1024;

function clip(value, max = MAX_PARAM_LEN) {
  const s = value == null ? "" : String(value);
  const cleaned = s.replace(/\s+/g, " ").trim();
  if (!cleaned) return "—";
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
}

function textParam(value) {
  return { type: "text", text: clip(value) };
}

/**
 * @typedef {Object} WhatsAppTemplateDef
 * @property {string} metaName - Approved template name in Meta
 * @property {string} language - BCP-47 language code (e.g. en, en_US)
 * @property {string} description
 * @property {(ctx: TemplateContext) => Array<{type:string,text:string}>} buildBodyParams
 */

/**
 * @typedef {Object} TemplateContext
 * @property {{ title?: string, body?: string, actionButton?: any }} message
 * @property {Object} metadata
 * @property {{ phone?: string, fullName?: string, email?: string }} recipient
 */

/** @type {Record<string, WhatsAppTemplateDef>} */
export const WHATSAPP_TEMPLATES = {
  general_announcement: {
    metaName: "general_announcement",
    language: process.env.COMM_WHATSAPP_TEMPLATE_LANG || "en",
    description: "Dear {{1}}, *{{2}}* — {{3}}",
    buildBodyParams(ctx) {
      const name = ctx.recipient?.fullName || ctx.metadata?.recipientName || "Parent/Guardian";
      const title = ctx.message?.title || "School Notice";
      const body = ctx.message?.body || ctx.message?.message || "";
      return [textParam(name), textParam(title), textParam(body)];
    },
  },

  student_absent: {
    metaName: "student_absent",
    language: process.env.COMM_WHATSAPP_TEMPLATE_LANG || "en",
    description:
      "Dear {{1}}, your ward {{2}} (Grade {{3}}-{{4}}) was marked absent on {{5}}.",
    buildBodyParams(ctx) {
      const m = ctx.metadata || {};
      const name = ctx.recipient?.fullName || m.recipientName || "Parent/Guardian";
      return [
        textParam(name),
        textParam(m.studentName || m.wardName || "your ward"),
        textParam(m.gradeName || m.grade || "—"),
        textParam(m.sectionName || m.section || "—"),
        textParam(m.date || m.absentDate || new Date().toISOString().slice(0, 10)),
      ];
    },
  },

  fee_reminder: {
    metaName: "fee_reminder",
    language: process.env.COMM_WHATSAPP_TEMPLATE_LANG || "en",
    description:
      "Dear {{1}}, {{2}} term fee of ₹{{3}} for {{4}} is due on {{5}}.",
    buildBodyParams(ctx) {
      const m = ctx.metadata || {};
      const name = ctx.recipient?.fullName || m.recipientName || "Parent/Guardian";
      return [
        textParam(name),
        textParam(m.termName || m.feeTerm || "current"),
        textParam(m.amount != null ? String(m.amount) : m.feeAmount || "—"),
        textParam(m.studentName || m.wardName || "your ward"),
        textParam(m.dueDate || m.due_on || "soon"),
      ];
    },
  },
};

/**
 * Map automation / communication context to a registry key.
 * @param {Object} metadata
 * @returns {string}
 */
export function resolveTemplateKey(metadata = {}) {
  if (metadata.whatsappTemplate || metadata.templateKey || metadata.templateName) {
    const key = metadata.whatsappTemplate || metadata.templateKey || metadata.templateName;
    if (WHATSAPP_TEMPLATES[key]) return key;
    // Allow raw Meta name if it matches a known metaName
    const byMeta = Object.entries(WHATSAPP_TEMPLATES).find(([, def]) => def.metaName === key);
    if (byMeta) return byMeta[0];
  }

  const event = `${metadata.sourceModule || ""}:${metadata.sourceEvent || ""}`.toLowerCase();
  if (event.includes("absent") || event.includes("attendance")) return "student_absent";
  if (event.includes("fee") || event.includes("payment") || event.includes("due")) return "fee_reminder";

  const type = (metadata.communicationType || metadata.type || "").toLowerCase();
  if (type === "reminder" && (metadata.sourceModule || "").toLowerCase().includes("fee")) {
    return "fee_reminder";
  }

  return "general_announcement";
}

/**
 * Build Meta Cloud API template payload component for body parameters.
 * @param {string} templateKey
 * @param {TemplateContext} ctx
 */
export function buildTemplatePayload(templateKey, ctx) {
  const def = WHATSAPP_TEMPLATES[templateKey] || WHATSAPP_TEMPLATES.general_announcement;
  const parameters = def.buildBodyParams(ctx);
  return {
    name: def.metaName,
    language: { code: def.language },
    components: [
      {
        type: "body",
        parameters,
      },
    ],
  };
}

export function listWhatsAppTemplates() {
  return Object.entries(WHATSAPP_TEMPLATES).map(([key, def]) => ({
    key,
    metaName: def.metaName,
    language: def.language,
    description: def.description,
  }));
}
