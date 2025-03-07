import fastifyLogo from '#client/assets/fastify.svg'

import { Form, type MetaFunction } from 'react-router'

import image from './ViFyRe_Image.png'
import reactRouterLogo from '#client/assets/react-router.svg'
import reactLogo from '#client/assets/react.svg'
import viteLogo from '#client/assets/vite.svg'
import { LinkCard } from '#client/components/common/app/link-card'
import { Button } from '#client/components/ui/button'
import { Input } from '#client/components/ui/input'
import { TextShimmer } from '#client/components/ui/text-shimmer'

export const meta: MetaFunction = () => {
  return [{ title: 'Vifyre' }]
}

export default function Route() {
  return (
    <div className="p-1 flex flex-col justify-start gap-16">
      <div className="w-full flex flex-col items-center gap-6">
        <TextShimmer className="text-2xl font-semibold tracking-wide">ViFyRe</TextShimmer>
        <div className="w-fit h-80 rounded-2xl overflow-clip">
          <img src={image} alt="Vifyre loogo" className="h-full" />
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-4 mb-10">
        <div>
          <div className="text-center font-medium">Welcome to FullStack!</div>
          <div className="font-light">
            You can start by trying wrong email, and then enter{' '}
            <span className="font-normal text-pirmary underline">admin@admin.com</span>
          </div>
        </div>
        <Form className="flex justify-start items-center gap-2 w-fit">
          <Input type="email" name="email" placeholder="Enter email to log in" />
          <Button type="submit">Log In</Button>
        </Form>
      </div>
      <div className="flex justify-between">
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
