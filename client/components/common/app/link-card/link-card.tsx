import { ExternalLink } from 'lucide-react'

import { Card, CardContent, CardHeader } from '#client/components/ui/card'
interface LinkCardProps {
  href: string
  logo: string
  title: string
  description: string
}

export function LinkCard({ href, logo, title, description }: LinkCardProps) {
  return (
    <Card>
      <CardHeader>
        <a href={href} target="_blank" className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-4">
            <div className="size-10 flex justify-center items-center">
              <img src={logo} alt={`${title} logo`} className="size-full" />
            </div>
            <div className="text-2xl font-medium">{title}</div>
          </div>
          <ExternalLink className="size-6" />
        </a>
      </CardHeader>
      <CardContent>
        <div className="font-light">{description}</div>
      </CardContent>
    </Card>
  )
}
