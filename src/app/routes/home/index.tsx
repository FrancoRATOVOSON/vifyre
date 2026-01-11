import { createFileRoute, getRouteApi, useNavigate } from '@tanstack/react-router'

import { HomePage } from '#/app/components/app/home'
import { findUserByMail } from '#/services/user.service'

const RouteComponent = () => {
  const routeApi = getRouteApi('/home/')
  const data = routeApi.useLoaderData()
  const navigate = useNavigate()

  if (data.error || !data.data) return navigate({ to: '/' })
  return <HomePage user={data.data} />
}

export const Route = createFileRoute('/home/')({
  loader: async ({ context: { prisma } }) => {
    const result = await findUserByMail(prisma, 'admin@admin.com')
    return result
  },
  component: RouteComponent
})
