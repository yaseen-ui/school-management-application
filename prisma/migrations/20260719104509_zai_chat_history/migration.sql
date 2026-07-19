-- CreateTable
CREATE TABLE "zai_chats" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Chat',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zai_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zai_messages" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "queryUsed" JSONB,
    "resultData" JSONB,
    "resultCount" INTEGER,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "zai_chats_tenantId_userId_idx" ON "zai_chats"("tenantId", "userId");

-- CreateIndex
CREATE INDEX "zai_chats_tenantId_updatedAt_idx" ON "zai_chats"("tenantId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "zai_chats_id_tenantId_key" ON "zai_chats"("id", "tenantId");

-- CreateIndex
CREATE INDEX "zai_messages_chatId_createdAt_idx" ON "zai_messages"("chatId", "createdAt");

-- AddForeignKey
ALTER TABLE "zai_chats" ADD CONSTRAINT "zai_chats_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zai_chats" ADD CONSTRAINT "zai_chats_userId_tenantId_fkey" FOREIGN KEY ("userId", "tenantId") REFERENCES "users"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "zai_messages" ADD CONSTRAINT "zai_messages_chatId_tenantId_fkey" FOREIGN KEY ("chatId", "tenantId") REFERENCES "zai_chats"("id", "tenantId") ON DELETE CASCADE ON UPDATE CASCADE;
