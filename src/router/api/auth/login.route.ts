import * as z from 'zod'

import { loginSchema } from '#/schema/user.schema'
import { findUserByMail } from '#/services/user.service'
import { CreateRouteObjectFunctionType } from '#/utils/types'

const createLoginRoute: CreateRouteObjectFunctionType<{
  Body: z.infer<typeof loginSchema>
}> = server => ({
  method: 'POST',
  url: '/login',
  schema: {
    body: loginSchema
  },
  async handler(req, rep) {
    const result = await findUserByMail(server.prisma, req.body.email)

    if (result.error) throw result.error

    if (!result.data) rep.status(404).send()
    else rep.status(200).send(result.data)
  }
})

export default createLoginRoute
