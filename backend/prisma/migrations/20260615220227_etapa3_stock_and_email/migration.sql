-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE 'overbooked';

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "confirmationEmailSentAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0;
