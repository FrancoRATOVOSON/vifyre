import { PrismaClient, User } from '@prisma/client'

import { Result } from '#/utils/types'

export const findUserByMail = async (
  prisma: PrismaClient,
  email: string
): Promise<Result<User | null>> => {
  try {
    const result = await prisma.user.findUnique({ where: { email } })
    return { data: result }
  } catch (error) {
    return {
      error: error as Error
    }
  }
}
