// Alfabeto sem caracteres ambíguos (0/O, 1/I/L) para leitura humana e QR.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Gera um código no formato "ABC-D2E-F3G" (3 grupos de 3). */
export function generateRegistrationCode(): string {
  const group = () =>
    Array.from(
      { length: 3 },
      () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
    ).join('');
  return `${group()}-${group()}-${group()}`;
}

/** Normaliza um código informado (QR/busca): maiúsculas e sem espaços. */
export function normalizeRegistrationCode(code: string): string {
  return code.trim().toUpperCase();
}

interface CodeLookupClient {
  registration: {
    findUnique: (args: {
      where: { code: string };
      select: { id: true };
    }) => Promise<{ id: string } | null>;
  };
}

/**
 * Gera um código único garantindo ausência de colisão no banco.
 * Aceita tanto `prisma.db` quanto um client de transação (`tx`).
 */
export async function generateUniqueRegistrationCode(
  client: CodeLookupClient,
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateRegistrationCode();
    const existing = await client.registration.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  throw new Error('Não foi possível gerar um código de inscrição único');
}
