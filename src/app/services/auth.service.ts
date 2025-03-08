import type { User } from '@prisma/client'

import { postApi } from '../client/axios'

export const login = (email: string): Promise<User | null> => postApi('/auth/login', { email })
