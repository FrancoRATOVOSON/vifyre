import { useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'

import { PostList } from '#/app/components/common/home/post-list'
import { Alert, AlertDescription, AlertTitle } from '#/app/components/ui/alert'
import { Skeleton } from '#/app/components/ui/skeleton'
import { getPostList } from '#/app/services/post.service'

export function Posts() {
  const { data, isLoading, error } = useQuery({ queryKey: ['get-post-list'], queryFn: getPostList })

  if (isLoading) return <Skeleton className="h-10 w-64" />

  if (!data || error)
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error ? error.message : 'Something went wrong'}</AlertDescription>
      </Alert>
    )

  return <PostList posts={data} />
}
