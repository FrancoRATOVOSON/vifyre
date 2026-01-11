import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { IndexPage } from '#/app/components/app/index'

const RouteComponent = () => {
  const navigate = useNavigate()

  const onSuccess = () => {
    console.log('Redirecting...')
    return navigate({ to: '/home' })
  }

  return <IndexPage onSuccess={onSuccess} />
}

export const Route = createFileRoute('/')({
  component: RouteComponent
})
