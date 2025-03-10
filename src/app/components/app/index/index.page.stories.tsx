import type { Meta, StoryObj } from '@storybook/react'

import { IndexPage } from './index.page'

const meta: Meta<typeof IndexPage> = {
  title: 'Home Page',
  render: () => <IndexPage />
}

export default meta
type Story = StoryObj<typeof IndexPage>

export const Page: Story = {}
