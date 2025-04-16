# vifyre

React server sode rendered powered by Fastify, Vite and React Router.

Vifyre (read Vee-Fire) is Vite standing between React and Fastify to offer a very fast and great SSR tool.
The name is from VIte - fastiFY - REact.

## Motivation

TLDR: Just didn't want too use Next.js anymore.

Originally, I wanted to build a project with Fastify but it turns out that my frontend needed to be server side rendered (for SEO reasons).
My main knowledges are around React.js and I'm pretty good at it, so I wanted to use React but there's the thing: Hw can I server side render a React application with Fastify ?

### Option 1 : [@fastify/vite](https://github.com/fastify/fastify-vite)

Of course, the obvious answer, with [@fastify/react](https://fastify-vite.dev/react/). But the thing is that the project is not mature enought, still has some bugs and lack strong Typescript support. I already try this solution with some example, you can find (fork and contribute) [here](https://github.com/FrancoRATOVOSON/fastify-vite-examples). So even if I realy want to use this plugin, at this moment, I can't.

### Option 2 : [@tanStack/router](https://tanstack.com/router/latest)

With [@tanstack/react-start](https://tanstack.com/start/latest), I think they are not mature enough, especialy `@tanstack/react-start` which is still in beta.

### The answer : [React Router](https://reactrouter.com/home)

React router V7 is a very mature project (since it's basically Remix) with a strong support for Server Side Rendering, full type support and easy integration with any custom server you have.

## Credits

* [Frank Fiegel](https://twitter.com/punkpeye)'s article on [React Router v7 and Fastify](https://glama.ai/blog/2024-12-05-remix-with-fastify)

## Future

Note that this stack is temporary, waiting for [@fastify/React](https://fastify-vite.dev/react/) to be both pproduction and Typescript Ready.
