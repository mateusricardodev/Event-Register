export class PrismaClient {
  constructor(_opts?: unknown) {}
  async $connect() {}
  async $disconnect() {}
  async $transaction(arg: unknown) {
    if (Array.isArray(arg)) return Promise.all(arg);
    if (typeof arg === 'function') return arg(this);
    return arg;
  }
}
