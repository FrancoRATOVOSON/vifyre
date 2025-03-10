import { createFileRoute } from '@tanstack/react-router'

import { IdPostPage } from '#/app/components/app/posts'

const RouteComponent = () => {
  return (
    <IdPostPage
      title="Some Title"
      content={`Yes, for nooow it's still static! We are working on making it dynamic, calm down`}
    />
  )
}

export const Route = createFileRoute('/posts/$id')({
  // loader: ({params}) =>
  component: RouteComponent
})
