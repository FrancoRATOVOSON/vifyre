import { ExternalLink } from 'lucide-react'

import { Card, CardContent, CardHeader } from '#/app/components/ui/card'
import { cn } from '#/app/lib/utils'
interface LinkCardProps {
  href: string
  logo: string
  title: string
  description: string
  className?: string
}

export function LinkCard({ href, logo, title, description, className }: LinkCardProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <a
          href={href}
          target="_blank"
          className="flex items-center justify-between"
          rel="noreferrer"
        >
          <div className="flex items-center justify-start gap-4">
            <div className="flex size-8 items-center justify-center">
              <img src={logo} alt={`${title} logo`} className="size-full" />
            </div>
            <div className="text-xl font-medium">{title}</div>
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
