import React from 'react'

import type { User } from '@prisma/client'

import { Posts } from './posts'
import { UserCard } from '#/app/components/common/home/user-card'

export default function Page() {
  const [user, setUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    try {
      const storageItem = localStorage.getItem('user')
      if (storageItem) {
        const user = JSON.parse(storageItem)
        setUser(user)
      }
    } catch (_error) {}
  }, [])

  return (
    <div className="p-16 flex flex-col items-center gap-10">
      <div>{user ? <UserCard className="w-fit" user={user} /> : <h1>Home</h1>}</div>
      <div>
        <Posts />
      </div>
    </div>
  )
}
