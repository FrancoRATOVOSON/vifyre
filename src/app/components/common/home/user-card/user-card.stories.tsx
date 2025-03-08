import { Meta, StoryObj } from '@storybook/react'

import { UserCard } from './user-card'

const meta: Meta<typeof UserCard> = {
  title: 'UserCard',
  component: UserCard
}

export default meta

type Story = StoryObj<typeof UserCard>

export const Component: Story = {
  args: {
    user: {
      id: 1,
      email: 'example@email.com',
      name: 'User Name'
    }
  }
}
