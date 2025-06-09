import { Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface NotificationButtonProps {
  notifications: Array<{
    id: string
    type: string
    content: string
    isRead: boolean
    createdAt: string
  }>
  unreadCount: number
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  notifications,
  unreadCount,
  onMarkRead,
  onMarkAllRead
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center",
                unreadCount > 0 && "animate-[ping_1s_ease-in-out_infinite] scale-105"
              )}
              style={{
                animation: unreadCount > 0 ? "shake 0.82s cubic-bezier(.36,.07,.19,.97) both infinite" : "none",
              }}
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onMarkAllRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "p-4 border-b last:border-0 flex items-start gap-2",
                    !notification.isRead ? "bg-muted/50 animate-pulse" : ""
                  )}
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium capitalize">
                        {notification.type.replace(/_/g, ' ')}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.content}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => onMarkRead(notification.id)}
                      className={`p-1 rounded-full transition-transform ${
                        notification.isRead 
                          ? "bg-green-100 text-green-600" 
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:scale-110"
                      }`}
                      aria-label={notification.isRead ? "Marked as read" : "Mark as read"}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationButton