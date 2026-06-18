-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'organizer', 'user');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('pending', 'confirmed', 'canceled', 'overbooked');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed');

-- CreateTable
CREATE TABLE "User" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "role"      "Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id"              TEXT NOT NULL,
    "title"           TEXT NOT NULL,
    "description"     TEXT,
    "location"        TEXT,
    "date"            TIMESTAMP(3) NOT NULL,
    "endDate"         TIMESTAMP(3),
    "bannerUrl"       TEXT,
    "slug"            TEXT,
    "category"        TEXT,
    "maxParticipants" INTEGER,
    "organizerPhone"  TEXT,
    "isPublished"     BOOLEAN NOT NULL DEFAULT false,
    "about"           TEXT,
    "formFields"      TEXT,
    "createdBy"       TEXT NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVolunteer" (
    "id"        TEXT NOT NULL,
    "eventId"   TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventVolunteer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPaymentMethod" (
    "id"           TEXT NOT NULL,
    "eventId"      TEXT NOT NULL,
    "type"         TEXT NOT NULL,
    "value"        DECIMAL(65,30) NOT NULL DEFAULT 0,
    "installments" INTEGER NOT NULL DEFAULT 1,
    "startDate"    TIMESTAMP(3),
    "endDate"      TIMESTAMP(3),
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id"        TEXT NOT NULL,
    "eventId"   TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "price"     DECIMAL(65,30) NOT NULL DEFAULT 0,
    "quantity"  INTEGER NOT NULL,
    "sold"      INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id"                      TEXT NOT NULL,
    "userId"                  TEXT NOT NULL,
    "eventId"                 TEXT NOT NULL,
    "ticketId"                TEXT,
    "status"                  "RegistrationStatus" NOT NULL DEFAULT 'pending',
    "cpf"                     TEXT,
    "phone"                   TEXT,
    "birthDate"               TIMESTAMP(3),
    "extraFields"             TEXT,
    "code"                    TEXT,
    "checkedIn"               BOOLEAN NOT NULL DEFAULT false,
    "checkedInAt"             TIMESTAMP(3),
    "checkedInBy"             TEXT,
    "confirmationEmailSentAt" TIMESTAMP(3),
    "createdAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckinLog" (
    "id"             TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "eventId"        TEXT NOT NULL,
    "action"         TEXT NOT NULL,
    "performedBy"    TEXT NOT NULL,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CheckinLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id"                TEXT NOT NULL,
    "registrationId"    TEXT NOT NULL,
    "amount"            DECIMAL(65,30) NOT NULL,
    "status"            "PaymentStatus" NOT NULL DEFAULT 'pending',
    "provider"          TEXT NOT NULL DEFAULT 'mock',
    "providerPaymentId" TEXT,
    "qrCodeBase64"      TEXT,
    "qrCodeCopiaECola"  TEXT,
    "expiresAt"         TIMESTAMP(3),
    "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"         TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "EventVolunteer_eventId_userId_key" ON "EventVolunteer"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_code_key" ON "Registration"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_registrationId_key" ON "Payment"("registrationId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdBy_fkey"
    FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteer" ADD CONSTRAINT "EventVolunteer_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVolunteer" ADD CONSTRAINT "EventVolunteer_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPaymentMethod" ADD CONSTRAINT "EventPaymentMethod_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey"
    FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_ticketId_fkey"
    FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckinLog" ADD CONSTRAINT "CheckinLog_registrationId_fkey"
    FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_registrationId_fkey"
    FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
