'use server'

import { signIn } from '@/auth'
import { db } from '@/lib/db'
import { loginSchema, registerSchema } from '@/lib/zod'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    })
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message }
    }
    return { error: 'Error 500' }
  }
}

export const registerAction = async (
  values: z.infer<typeof registerSchema>
) => {
  try {
    const { data, success } = registerSchema.safeParse(values)

    if (!success) {
      return {
        error: 'Invalid data'
      }
    }

    // Verificar si el usuario existe
    const user = await db.user.findUnique({
      where: {
        email: data.email
      }
    })

    if (user) {
      return {
        error: 'User already exists'
      }
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: passwordHash
      }
    })
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message }
    }
    return { error: 'Error 500' }
  }
}
