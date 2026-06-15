import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import bcrypt from 'bcrypt';
import { generateUniqueRegistrationCode } from '../src/common/registration-code.js';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const fakeUsers = [
  { name: 'Ana Beatriz Santos', email: 'ana.beatriz@email.com' },
  { name: 'Carlos Eduardo Lima', email: 'carlos.lima@email.com' },
  { name: 'Fernanda Oliveira', email: 'fernanda.oliveira@email.com' },
  { name: 'João Pedro Almeida', email: 'joao.pedro@email.com' },
  { name: 'Mariana Costa', email: 'mariana.costa@email.com' },
  { name: 'Rafael Souza', email: 'rafael.souza@email.com' },
  { name: 'Juliana Ferreira', email: 'juliana.ferreira@email.com' },
  { name: 'Lucas Pereira', email: 'lucas.pereira@email.com' },
  { name: 'Bruna Martins', email: 'bruna.martins@email.com' },
  { name: 'Gabriel Rodrigues', email: 'gabriel.rodrigues@email.com' },
  { name: 'Camila Nascimento', email: 'camila.nascimento@email.com' },
  { name: 'Thiago Barbosa', email: 'thiago.barbosa@email.com' },
  { name: 'Larissa Mendes', email: 'larissa.mendes@email.com' },
  { name: 'Felipe Carvalho', email: 'felipe.carvalho@email.com' },
  { name: 'Isabela Teixeira', email: 'isabela.teixeira@email.com' },
  { name: 'Matheus Gomes', email: 'matheus.gomes@email.com' },
  { name: 'Leticia Araujo', email: 'leticia.araujo@email.com' },
  { name: 'Diego Cavalcante', email: 'diego.cavalcante@email.com' },
  { name: 'Amanda Ribeiro', email: 'amanda.ribeiro@email.com' },
  { name: 'Vinicius Dias', email: 'vinicius.dias@email.com' },
];

const statuses: ('pending' | 'confirmed' | 'canceled')[] = [
  'confirmed', 'confirmed', 'confirmed', 'confirmed', 'confirmed',
  'confirmed', 'confirmed', 'confirmed', 'confirmed', 'confirmed',
  'confirmed', 'confirmed', 'confirmed', 'confirmed', 'confirmed',
  'pending', 'pending', 'pending',
  'canceled', 'canceled',
];

async function main() {
  console.log('🌱 Iniciando seed...');

  const hashedPassword = await bcrypt.hash('Senha@123', 10);

  // Criar organizador
  const organizer = await prisma.user.upsert({
    where: { email: 'organizador@congresso.com' },
    update: {},
    create: {
      name: 'Organizador Congresso',
      email: 'organizador@congresso.com',
      password: hashedPassword,
      role: 'organizer',
    },
  });
  console.log('✅ Organizador criado:', organizer.email);

  // Criar evento
  const event = await prisma.event.upsert({
    where: { id: 'congresso-jovem-2026' },
    update: {},
    create: {
      id: 'congresso-jovem-2026',
      title: 'Congresso Jovem 2026',
      description: 'Congresso anual para jovens com palestras, workshops e momentos de louvor.',
      location: 'Centro de Convenções - São Paulo, SP',
      date: new Date('2026-07-15T09:00:00'),
      createdBy: organizer.id,
    },
  });
  console.log('✅ Evento criado:', event.title);

  // Criar ticket
  const ticket = await prisma.ticket.upsert({
    where: { id: 'ticket-congresso-geral' },
    update: {},
    create: {
      id: 'ticket-congresso-geral',
      eventId: event.id,
      name: 'Inscrição Geral',
      price: 0,
      quantity: 500,
    },
  });
  console.log('✅ Ticket criado:', ticket.name);

  // Criar voluntário (login do app mobile de credenciamento) e vinculá-lo ao evento
  const volunteer = await prisma.user.upsert({
    where: { email: 'voluntario@congresso.com' },
    update: {},
    create: {
      name: 'Voluntário Portaria',
      email: 'voluntario@congresso.com',
      password: hashedPassword,
      role: 'user',
    },
  });
  await prisma.eventVolunteer.upsert({
    where: { eventId_userId: { eventId: event.id, userId: volunteer.id } },
    update: {},
    create: { eventId: event.id, userId: volunteer.id },
  });
  console.log('✅ Voluntário vinculado:', volunteer.email);

  // Criar usuários falsos e inscrições
  for (let i = 0; i < fakeUsers.length; i++) {
    const userData = fakeUsers[i];
    const status = statuses[i];

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: 'user',
      },
    });

    const existingReg = await prisma.registration.findFirst({
      where: { userId: user.id, eventId: event.id },
    });

    if (!existingReg) {
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const code = await generateUniqueRegistrationCode(prisma);
      // Marca ~2/3 dos confirmados como já credenciados, para demonstrar a tela.
      const alreadyCheckedIn = status === 'confirmed' && i % 3 !== 0;

      const registration = await prisma.registration.create({
        data: {
          userId: user.id,
          eventId: event.id,
          ticketId: ticket.id,
          status,
          createdAt,
          code,
          checkedIn: alreadyCheckedIn,
          checkedInAt: alreadyCheckedIn ? new Date() : null,
          checkedInBy: alreadyCheckedIn ? volunteer.id : null,
        },
      });

      if (status === 'confirmed') {
        await prisma.payment.create({
          data: {
            registrationId: registration.id,
            amount: ticket.price,
            status: 'paid',
            provider: 'mock',
          },
        });
      }

      console.log(`✅ Inscrito: ${user.name} [${status}] ${code}`);
    } else {
      console.log(`⚠️  Já inscrito: ${user.name}`);
    }
  }

  console.log('\n🎉 Seed concluído!');
  console.log('📧 Login do organizador: organizador@congresso.com');
  console.log('🙋 Login do voluntário: voluntario@congresso.com');
  console.log('🔑 Senha: Senha@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
