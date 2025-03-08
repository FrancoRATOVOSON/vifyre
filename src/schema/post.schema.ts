import { z } from 'zod'

const singlePostSchema = z.object({
  id: z.number(),
  title: z.string()
})

export const postsList = z.array(singlePostSchema)
