import { createFileRoute } from '@tanstack/react-router'

import { HomePage } from '#/app/components/app/home'

export const Route = createFileRoute('/home/')({
  component: HomePage
})
