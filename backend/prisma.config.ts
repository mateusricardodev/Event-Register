import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrate: {
    async adapter(env) {
      const { Pool } = await import('pg')
      const pool = new Pool({ connectionString: env.DATABASE_URL })
      return new PrismaPg(pool)
    },
  },
})
