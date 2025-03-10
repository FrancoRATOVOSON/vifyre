import fastifyLogo from '#/app/assets/fastify.svg'

import reactRouterLogo from '#/app/assets/react-router.svg'
import reactLogo from '#/app/assets/react.svg'
import image from '#/app/assets/ViFyRe_Image.png'
import viteLogo from '#/app/assets/vite.svg'
import { LinkCard } from '#/app/components/app/index/link-card'
import { Button } from '#/app/components/ui/button'
import { Input } from '#/app/components/ui/input'
import { TextShimmer } from '#/app/components/ui/text-shimmer'

export const IndexPage = () => {
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
        <form className="flex w-fit items-start justify-start gap-2" method="post">
          <div className="flex flex-col gap-0">
            <Input type="email" name="email" placeholder="Enter email to log in" />
          </div>
          <Button type="submit">Log In</Button>
        </form>
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
