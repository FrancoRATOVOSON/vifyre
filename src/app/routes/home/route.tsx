import { redirect, useLoaderData } from 'react-router'

import type { User } from '@prisma/client'

import { UserCard } from '#/app/components/common/home/user-card'

export async function clientLoader() {
  try {
    const storageItem = localStorage.getItem('user')

    if (!storageItem) return redirect('/')
    const user: User = JSON.parse(storageItem)
    return { data: user }
  } catch (_error) {
    return redirect('/')
  }
}

type LoaderDataType = Exclude<Awaited<ReturnType<typeof clientLoader>>, Response>

export default function Page() {
  const user = useLoaderData<LoaderDataType>().data

  return (
    <div>
      <div>
        <UserCard user={user} />
      </div>
    </div>
  )
}
