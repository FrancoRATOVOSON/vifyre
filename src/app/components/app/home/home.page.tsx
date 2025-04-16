import type { User } from '@prisma/client'

import { Posts } from './posts'
import { UserCard } from './user-card'

interface HomePageProps {
  user: User
}

export const HomePage = ({ user }: HomePageProps) => {
  return (
    <div className="flex flex-col items-center gap-10 p-16">
      <div>{user ? <UserCard className="w-fit" user={user} /> : <h1>Home</h1>}</div>
      <div>
        <Posts />
      </div>
    </div>
  )
}
