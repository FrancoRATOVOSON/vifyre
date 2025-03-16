import { createFileRoute } from '@tanstack/react-router'

import { IndexPage } from '#/app/components/app/index'

export const Route = createFileRoute('/')({
  component: IndexPage
})
