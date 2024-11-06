'use client'

import { registerSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { signIn } from '@/auth'
// import { signIn } from 'next-auth/react'
import { registerAction } from '@/actions/auth-action'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const FormRegister = () => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null)
    startTransition(async () => {
      // await signIn('credentials', {
      //   email: values.email,
      //   password: values.password,
      //   redirect: false
      // })
      const response = await registerAction(values)
      if (response.error) {
        setError(response.error)
      } else {
        router.push('/dashboard')
      }
    })
  }

  return (
    <div className="max-w-52">
      <h1 className="font-bold">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="name" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {error && <FormMessage>{error}</FormMessage>}
          <Button type="submit" disabled={isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default FormRegister