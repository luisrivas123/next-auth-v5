'use client'

import React from 'react'
import { Button } from './ui/button'
import { signOut } from 'next-auth/react'

const LogoutButton = () => {
  const handleClick = async () => {
    await signOut({
      callbackUrl: '/login',
      redirect: true
    })
  }

  return <Button onClick={handleClick}>Logout</Button>
}

export default LogoutButton
