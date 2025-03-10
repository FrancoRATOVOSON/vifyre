import type { Post } from '@prisma/client'

import { Link } from '@tanstack/react-router'

interface PostListProps {
  posts: Array<Omit<Post, 'content'>>
}

export function PostList({ posts }: PostListProps) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map(({ id, title }, idx) => (
        <Link
          key={id}
          to={`/post/${id}`}
          className="text-blue-950 hover:underline hover:text-blue-600"
        >{`${idx + 1} - ${title}`}</Link>
      ))}
    </div>
  )
}
