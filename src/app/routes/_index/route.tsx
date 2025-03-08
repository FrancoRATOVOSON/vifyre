import fastifyLogo from '#/app/assets/fastify.svg'

import { redirect, useFetcher, type MetaFunction } from 'react-router'

import { Loader2 } from 'lucide-react'

import type { Route } from '#react-router/routes/_index/+types/route'

import image from './ViFyRe_Image.png'
import reactRouterLogo from '#/app/assets/react-router.svg'
import reactLogo from '#/app/assets/react.svg'
import viteLogo from '#/app/assets/vite.svg'
import { LinkCard } from '#/app/components/common/app/link-card'
import { Button } from '#/app/components/ui/button'
import { Input } from '#/app/components/ui/input'
import { TextShimmer } from '#/app/components/ui/text-shimmer'
import { login } from '#/app/services/auth.service'

export const meta: MetaFunction = () => {
  return [{ title: 'Vifyre' }]
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const email = (await request.formData()).get('email')
    if (!email || typeof email !== 'string') return { message: 'Email is required' }

    const result = await login(email)
    if (!result) return { message: 'User not found' }
    localStorage.setItem('user', JSON.stringify(result))
    return redirect('/home')
  } catch (error) {
    return { error: (error as Error).message }
  }
}

export default function Page() {
  const fetcher = useFetcher()

  return (
    <div className="flex flex-col justify-start gap-16 p-10">
      <div className="flex w-full flex-col items-center gap-6">
        <TextShimmer className="text-2xl font-semibold tracking-wide">ViFyRe</TextShimmer>
        <div className="h-80 w-fit overflow-clip rounded-2xl">
          <img src={image} alt="Vifyre loogo" className="h-full" />
        </div>
      </div>
      <div className="mb-10 flex w-full flex-col items-center justify-center gap-4">
        <div>
          <div className="text-center font-medium">Welcome to FullStack!</div>
          <div className="font-light">
            You can start by trying wrong email, and then enter{' '}
            <span className="text-pirmary font-normal underline">admin@admin.com</span>
          </div>
        </div>
        <fetcher.Form className="flex w-fit items-start justify-start gap-2" method="post">
          <div className="flex flex-col gap-0">
            <Input type="email" name="email" placeholder="Enter email to log in" />
            {fetcher.data ? (
              <p className="ml-2 text-xs font-light text-destructive">
                {fetcher.data.message || fetcher.data.error}
              </p>
            ) : null}
          </div>
          <Button type="submit" disabled={fetcher.state === 'submitting'}>
            {fetcher.state === 'submitting' ? <Loader2 className="animate-spin" /> : null}
            Log In
          </Button>
        </fetcher.Form>
      </div>
      <div className="flex flex-wrap justify-between gap-y-6">
        <LinkCard
          title="Fastify"
          href="https://fastify.dev/"
          description="Fast and low overhead web framework, for Node.js."
          logo={fastifyLogo}
          className="basis-[24%]"
        />
        <LinkCard
          title="React"
          href="https://react.dev/"
          description="The library for web and native user interfaces."
          logo={reactLogo}
          className="basis-[24%]"
        />
        <LinkCard
          title="React Router"
          href="https://reactrouter.com/home"
          description="A declarative routing for React."
          logo={reactRouterLogo}
          className="basis-[24%]"
        />
        <LinkCard
          title="Vite"
          href="https://vite.dev/"
          description="The Build Tool for the Web."
          logo={viteLogo}
          className="basis-[24%]"
        />
      </div>
    </div>
  )
}
