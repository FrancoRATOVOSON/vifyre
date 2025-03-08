import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

import { postsList } from '#/schema/post.schema'
import { Result } from '#/utils/types'

export const getPostList = async (
  prisma: PrismaClient
): Promise<Result<z.infer<typeof postsList>>> => {
  try {
    const result = await prisma.post.findMany()
    return {
      data: result.map(({ id, title }) => ({ id, title }))
    }
  } catch (error) {
    return {
      error: error as Error
    }
  }
}
