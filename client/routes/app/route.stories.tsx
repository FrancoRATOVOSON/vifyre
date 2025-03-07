import type { Meta, StoryObj } from '@storybook/react'

import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router'

import Route from './route'

const meta: Meta<typeof Route> = {
  title: 'Home Page',
  render: () => <Route />,
  decorators: [withRouter]
}

export default meta
type Story = StoryObj<typeof Route>

export const Page: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      routing: {
        path: '/'
      }
    })
  }
}
