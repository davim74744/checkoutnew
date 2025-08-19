/*
  Warnings:

  - You are about to drop the `Lead` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Lead";

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "planValue" DOUBLE PRECISION NOT NULL,
    "planBonus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "checkoutStep" INTEGER NOT NULL DEFAULT 1,
    "pixTransactionId" TEXT,
    "pixQrCode" TEXT,
    "pixCopyPaste" TEXT,
    "cardHolderName" TEXT,
    "cardExpiry" TEXT,
    "cardCvv" TEXT,
    "cardNumber" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_cpf_key" ON "public"."Order"("cpf");
