import type { Post } from '@prisma/client'

import { getApi } from '#/app/client/axios'

export const getPostList = async () => {
  const result = await getApi<Array<Omit<Post, 'content'>>>('/posts')

  if (!result) return []
  return result
}
