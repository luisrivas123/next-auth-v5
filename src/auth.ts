import NextAuth from 'next-auth'
import authConfig from '@/auth.config'

import { PrismaAdapter } from '@auth/prisma-adapter'
// import { prisma } from '@/prisma'
import { db } from '@/lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig
  // providers: []
})
