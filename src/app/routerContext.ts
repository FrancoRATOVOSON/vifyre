import { PrismaClient } from '@prisma/client'

export type RouterContext = {
  head: string
  prisma: PrismaClient
}
