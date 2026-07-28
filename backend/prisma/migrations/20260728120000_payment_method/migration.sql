-- Modalidade escolhida pelo participante (pix, cash, credit_card, debit_card)
ALTER TABLE "Payment" ADD COLUMN "method" TEXT;

-- Backfill dos pagamentos existentes:
-- dinheiro é identificado pelo provider 'cash'
UPDATE "Payment" SET "method" = 'cash' WHERE "provider" = 'cash';

-- qualquer pagamento com QR Code veio do fluxo PIX
UPDATE "Payment" SET "method" = 'pix'
WHERE "method" IS NULL AND "qrCodeCopiaECola" IS NOT NULL;
