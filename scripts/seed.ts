import { PrismaClient, type User, type Post } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding your database...')

  const user: User = {
    id: 1,
    name: 'Admin',
    email: 'admin@admin.com'
  }

  await prisma.user.upsert({ where: { email: user.email }, update: {}, create: user })

  const posts: Post[] = [
    {
      id: 1,
      title: 'What do you think about this combination ?',
      content:
        'You are Server Side Rendering a React.js application using Fastify and React Router Framework. You can check in your browser devtools network tab that you get this page as a full html.'
    },
    {
      id: 2,
      title: 'Why we love Fastify',
      content:
        "Yes, of course with speed first in mind. But also it's way of treating everything as a plugin, but also the huge ecosystem is exciting."
    },
    {
      id: 3,
      title: 'Do you think you can run from React ?',
      content:
        "No, you can't! React is now the framework(library) of the web. You can love it or hate it, but it will forever be here."
    }
  ]

  for (const post of posts)
    await prisma.post.upsert({ where: { id: post.id }, update: {}, create: post })

  console.log('Seeding complete!')
}

await main()
