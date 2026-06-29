-- AlterTable
ALTER TABLE "store_orders" ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "paymentMode" TEXT,
ADD COLUMN     "transactionId" TEXT;
