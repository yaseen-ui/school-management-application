-- Communication Module — Phase 1 Schema
-- Tables: communications, communication_recipients, publications, publication_revisions,
--          notification_templates, automation_rules, channel_configurations

-- CreateEnum
DO $$ BEGIN CREATE TYPE "CommunicationType" AS ENUM ('notification', 'alert', 'reminder', 'action_required', 'emergency'); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "PublicationType" AS ENUM ('circular', 'announcement', 'notice_board', 'holiday_notice', 'event_notice', 'academic_notice'); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "CommunicationStatus" AS ENUM ('draft', 'sent', 'scheduled', 'cancelled'); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "PublicationStatus" AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'published', 'expired', 'archived', 'withdrawn'); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "CommunicationChannel" AS ENUM ('in_app', 'email', 'sms', 'push'); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "DeliveryStatus" AS ENUM ('pending', 'sent', 'delivered', 'failed', 'viewed', 'acknowledged'); EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN CREATE TYPE "SenderType" AS ENUM ('user', 'system'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- CreateTable: communications
CREATE TABLE IF NOT EXISTS "communications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" "CommunicationType" NOT NULL,
    "senderType" "SenderType" NOT NULL DEFAULT 'user',
    "senderId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "actionButton" JSONB,
    "scheduledAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "status" "CommunicationStatus" NOT NULL DEFAULT 'draft',
    "targetUserIds" JSONB,
    "targetRoles" JSONB,
    "targetGroups" JSONB,
    "targetGrades" JSONB,
    "targetSections" JSONB,
    "targetEmployeeTypes" JSONB,
    "targetAudience" JSONB,
    "automationRuleId" TEXT,
    "sourceModule" TEXT,
    "sourceEvent" TEXT,
    "sourceReference" JSONB,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communication_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "communications_tenantId_type_idx" ON "communications"("tenantId", "type");
CREATE INDEX IF NOT EXISTS "communications_tenantId_status_idx" ON "communications"("tenantId", "status");
CREATE INDEX IF NOT EXISTS "communications_tenantId_senderId_idx" ON "communications"("tenantId", "senderId");
CREATE INDEX IF NOT EXISTS "communications_tenantId_createdAt_idx" ON "communications"("tenantId", "createdAt");

-- CreateTable: communication_recipients
CREATE TABLE IF NOT EXISTS "communication_recipients" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "communicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'pending',
    "viewedAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communication_recipient_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "uniqueRecipientPerChannel" UNIQUE ("tenantId", "communicationId", "userId", "channel"),
    CONSTRAINT "communication_recipients_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "communication_recipients_tenantId_userId_idx" ON "communication_recipients"("tenantId", "userId");
CREATE INDEX IF NOT EXISTS "communication_recipients_tenantId_deliveryStatus_idx" ON "communication_recipients"("tenantId", "deliveryStatus");

-- CreateTable: publications
CREATE TABLE IF NOT EXISTS "publications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "type" "PublicationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "circularNumber" TEXT,
    "attachments" JSONB,
    "targetUserIds" JSONB,
    "targetRoles" JSONB,
    "targetGroups" JSONB,
    "targetGrades" JSONB,
    "targetSections" JSONB,
    "targetEmployeeTypes" JSONB,
    "targetAudience" JSONB,
    "publishDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "requireAcknowledgement" BOOLEAN NOT NULL DEFAULT false,
    "sendNotification" BOOLEAN NOT NULL DEFAULT false,
    "status" "PublicationStatus" NOT NULL DEFAULT 'draft',
    "submittedAt" TIMESTAMP(3),
    "submittedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvalRemarks" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectedById" TEXT,
    "rejectionReason" TEXT,
    "publishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "revision" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "publication_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "publications_tenantId_type_idx" ON "publications"("tenantId", "type");
CREATE INDEX IF NOT EXISTS "publications_tenantId_status_idx" ON "publications"("tenantId", "status");
CREATE INDEX IF NOT EXISTS "publications_tenantId_publishDate_idx" ON "publications"("tenantId", "publishDate");
CREATE INDEX IF NOT EXISTS "publications_tenantId_expiryDate_idx" ON "publications"("tenantId", "expiryDate");

-- CreateTable: publication_revisions
CREATE TABLE IF NOT EXISTS "publication_revisions" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "publicationId" TEXT NOT NULL,
    "revision" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "changedById" TEXT,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publication_revision_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "uniqueRevisionPerPublication" UNIQUE ("tenantId", "publicationId", "revision"),
    CONSTRAINT "publication_revisions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "publication_revisions_tenantId_publicationId_idx" ON "publication_revisions"("tenantId", "publicationId");

-- CreateTable: notification_templates
CREATE TABLE IF NOT EXISTS "notification_templates" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "CommunicationType" NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "defaultChannel" "CommunicationChannel" NOT NULL DEFAULT 'in_app',
    "defaultPriority" INTEGER NOT NULL DEFAULT 0,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_template_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "uniqueTemplateNamePerTenant" UNIQUE ("tenantId", "name"),
    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable: automation_rules
CREATE TABLE IF NOT EXISTS "automation_rules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sourceModule" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "channels" "CommunicationChannel"[] NOT NULL DEFAULT '{in_app}',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "cooldownMinutes" INTEGER,
    "filterCriteria" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_rule_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "uniqueRulePerEvent" UNIQUE ("tenantId", "sourceModule", "event"),
    CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "automation_rules_tenantId_sourceModule_idx" ON "automation_rules"("tenantId", "sourceModule");
CREATE INDEX IF NOT EXISTS "automation_rules_tenantId_isEnabled_idx" ON "automation_rules"("tenantId", "isEnabled");

-- CreateTable: channel_configurations
CREATE TABLE IF NOT EXISTS "channel_configurations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "provider" TEXT,
    "config" JSONB NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uniqueChannelPerTenant" UNIQUE ("tenantId", "channel"),
    CONSTRAINT "channel_configuration_tenant_identity" UNIQUE ("id", "tenantId"),
    CONSTRAINT "channel_configurations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
DO $$ BEGIN
ALTER TABLE "communications" ADD CONSTRAINT "communications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "communications" ADD CONSTRAINT "communications_senderId_tenantId_fkey" FOREIGN KEY ("senderId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "communication_recipients" ADD CONSTRAINT "communication_recipients_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "communication_recipients" ADD CONSTRAINT "communication_recipients_communicationId_tenantId_fkey" FOREIGN KEY ("communicationId", "tenantId") REFERENCES "communications"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "communication_recipients" ADD CONSTRAINT "communication_recipients_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "publications" ADD CONSTRAINT "publications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "publications" ADD CONSTRAINT "publications_submittedById_tenantId_fkey" FOREIGN KEY ("submittedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "publications" ADD CONSTRAINT "publications_approvedById_tenantId_fkey" FOREIGN KEY ("approvedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "publications" ADD CONSTRAINT "publications_rejectedById_tenantId_fkey" FOREIGN KEY ("rejectedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "publication_revisions" ADD CONSTRAINT "publication_revisions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "publication_revisions" ADD CONSTRAINT "publication_revisions_publicationId_tenantId_fkey" FOREIGN KEY ("publicationId", "tenantId") REFERENCES "publications"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "publication_revisions" ADD CONSTRAINT "publication_revisions_changedById_tenantId_fkey" FOREIGN KEY ("changedById", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "notification_templates" ADD CONSTRAINT "notification_templates_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "automation_rules" ADD CONSTRAINT "automation_rules_templateId_tenantId_fkey" FOREIGN KEY ("templateId", "tenantId") REFERENCES "notification_templates"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "channel_configurations" ADD CONSTRAINT "channel_configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null;
END $$;