export class PrismaClient {
    constructor(_opts) { }
    async $connect() { }
    async $disconnect() { }
    async $transaction(arg) {
        if (Array.isArray(arg))
            return Promise.all(arg);
        if (typeof arg === 'function')
            return arg(this);
        return arg;
    }
}
//# sourceMappingURL=prisma-client.js.map