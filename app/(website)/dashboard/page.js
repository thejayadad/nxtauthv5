import { auth } from '@/auth'
import React from 'react'

const DashboardPage = async () => {
    const session = await auth()
  return (
    <div>
        <h2>Welcome, <span>{session?.user?.name}</span></h2>
    </div>
  )
}

export default DashboardPage