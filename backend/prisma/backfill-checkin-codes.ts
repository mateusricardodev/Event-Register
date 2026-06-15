import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import { generateUniqueRegistrationCode } from '../src/common/registration-code.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const pending = await prisma.registration.findMany({
    where: { code: null },
    select: { id: true },
  });

  console.log(`🔢 ${pending.length} inscrição(ões) sem código. Gerando...`);

  for (const reg of pending) {
    const code = await generateUniqueRegistrationCode(prisma);
    await prisma.registration.update({ where: { id: reg.id }, data: { code } });
    console.log(`  reg=${reg.id} → ${code}`);
  }

  console.log('✅ Backfill de códigos concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
