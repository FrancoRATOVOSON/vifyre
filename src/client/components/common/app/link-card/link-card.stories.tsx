import type { Meta, StoryObj } from '@storybook/react'

import { LinkCard } from './link-card'
import reactLogo from '#client/assets/react.svg'

const meta: Meta<typeof LinkCard> = {
  title: 'LinkCard',
  component: LinkCard
}

export default meta

type Story = StoryObj<typeof LinkCard>

export const Component: Story = {
  args: {
    title: 'React',
    description:
      'The library for web and native user interfaces. React lets you build user interfaces out of individual pieces called components. Create your own React components like Thumbnail, LikeButton, and Video. Then combine them into entire screens, pages, and apps.',
    href: 'https://react.dev/',
    logo: reactLogo
  }
}
