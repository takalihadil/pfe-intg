"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Download, ExternalLink } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface MarketplaceItem {
  id: string
  title: string
  description: string
  type: 'template' | 'service' | 'tool' | 'resource'
  price: number
  rating: number
  reviews: number
  author: {
    name: string
    avatar: string
  }
  preview?: string
  downloads?: number
}

interface MarketplaceItemProps {
  item: MarketplaceItem
  view: 'grid' | 'list'
}

export function MarketplaceItem({ item, view }: MarketplaceItemProps) {
  const typeColors = {
    template: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    service: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
    tool: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    resource: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
  }

  return (
    <Card className={view === 'list' ? 'flex' : ''}>
      {item.preview && (
        <div 
          className={`
            bg-muted/50 
            ${view === 'list' ? 'w-48 shrink-0' : 'aspect-video'}
          `}
        >
          <img
            src={item.preview}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <CardContent className={`${view === 'list' ? 'h-full' : ''} pt-6`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={typeColors[item.type]}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span>{item.rating}</span>
                  <span className="text-muted-foreground">
                    ({item.reviews})
                  </span>
                </div>
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={item.author.avatar}
                  alt={item.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-muted-foreground">
                  {item.author.name}
                </span>
              </div>
              {item.downloads && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Download className="h-4 w-4" />
                  {item.downloads}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0">
          <div className="font-semibold">
            {item.price === 0 ? 'Free' : formatCurrency(item.price)}
          </div>
          <Button>
            {item.type === 'service' ? (
              <>
                Contact
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Download
                <Download className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}