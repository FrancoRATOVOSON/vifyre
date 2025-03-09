import { redirect } from 'react-router'

import type { Route } from '#react-router/routes/post.$id/+types/route'

import { getPost } from '#/services/post.service'
import { ServerContextType } from '#/utils/types'

export async function loader({ params, context }: Route.LoaderArgs) {
  const id = Number.parseInt(params.id)
  const { prisma } = context as ServerContextType
  const result = await getPost(prisma, id)

  if (!result.data) return redirect('/')
  return result.data
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const data = loaderData as unknown as Awaited<ReturnType<typeof loader>>
  if (!data || data instanceof Response) return null

  return (
    <div className="mt-16 flex flex-col gap-10">
      <h1 className="text-4xl font-medium text-center">{data.title}</h1>
      <p className="self-center w-1/2">{data.content}</p>
    </div>
  )
}
