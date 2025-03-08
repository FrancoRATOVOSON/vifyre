import { Link } from 'react-router'

import type { Post } from '@prisma/client'

interface PostListProps {
  posts: Array<Omit<Post, 'content'>>
}

export function PostList({ posts }: PostListProps) {
  return (
    <div>
      {posts.map(({ id, title }, idx) => (
        <Link key={id} to="#">{`${idx + 1} - ${title}`}</Link>
      ))}
    </div>
  )
}
