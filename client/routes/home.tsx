import * as React from 'react'
import type { LoaderFunction, MetaFunction } from 'react-router'

import { Welcome } from '../welcome'

export const meta: MetaFunction = () => {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' }
  ]
}

export const loader: LoaderFunction = ({ context }) => {
  console.log(JSON.stringify(context))
  return context
}

export default function Home() {
  return <Welcome />
}
