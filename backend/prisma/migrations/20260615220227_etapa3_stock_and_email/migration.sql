-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE IF NOT EXISTS 'overbooked';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "confirmationEmailSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "sold" INTEGER NOT NULL DEFAULT 0;
