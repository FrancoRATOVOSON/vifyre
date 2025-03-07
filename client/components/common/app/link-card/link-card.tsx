import { ExternalLink } from 'lucide-react'

import { Card, CardContent, CardHeader } from '#client/components/ui/card'
import { cn } from '#client/lib/utils'
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
        <a href={href} target="_blank" className="flex justify-between items-center">
          <div className="flex justify-start items-center gap-4">
            <div className="size-8 flex justify-center items-center">
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
