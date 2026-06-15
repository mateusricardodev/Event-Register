-- AlterTable
ALTER TABLE "Payment"
  ADD COLUMN "expiresAt" TIMESTAMP(3),
  ADD COLUMN "providerPaymentId" TEXT,
  ADD COLUMN "qrCodeBase64" TEXT,
  ADD COLUMN "qrCodeCopiaECola" TEXT,
  ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
