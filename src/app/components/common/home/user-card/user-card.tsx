import type { User } from '@prisma/client'

import { UserRound } from 'lucide-react'

import { Card, CardDescription, CardHeader, CardTitle } from '#/app/components/ui/card'
import { cn } from '#/app/lib/utils'

interface UserCardProps {
  user: User
  className?: string
}

export function UserCard({ user: { name, email }, className }: UserCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row justify-start items-start">
        <div className="flex justify-center items-center size-7">
          <UserRound className="size-5" />
        </div>
        <div>
          <CardTitle className="text-lg">{name || 'User Name'}</CardTitle>
          <CardDescription>{email}</CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}
