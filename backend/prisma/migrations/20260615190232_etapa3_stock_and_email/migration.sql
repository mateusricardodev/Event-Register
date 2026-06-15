-- Etapa 3: baixa de estoque atômica + e-mail de confirmação

-- Adiciona o valor 'overbooked' ao enum RegistrationStatus
ALTER TYPE "RegistrationStatus" ADD VALUE IF NOT EXISTS 'overbooked';

-- Contador de vagas confirmadas no Ticket (decrementado atomicamente na confirmação)
ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "sold" INTEGER NOT NULL DEFAULT 0;

-- Flag para garantir envio único do e-mail de confirmação
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "confirmationEmailSentAt" TIMESTAMP(3);
