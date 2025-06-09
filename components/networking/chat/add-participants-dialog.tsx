"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Loader2, UserPlus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  id_users?: string
  fullname: string
  profile_photo: string | null
  email?: string
}

interface AddParticipantsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddParticipants: (userIds: string[]) => void
  existingParticipantIds: string[]
}

export default function AddParticipantsDialog({
  open,
  onOpenChange,
  onAddParticipants,
  existingParticipantIds,
}: AddParticipantsDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const getAccessToken = () => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("access_token") ||
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        "dummy-token"
      )
    }
    return "dummy-token" // Fallback token
  }

  // Fetch users when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers()
    } else {
      // Reset state when dialog closes
      setSelectedUsers([])
      setSearchQuery("")
    }
  }, [open])

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.fullname.toLowerCase().includes(query) || (user.email && user.email.toLowerCase().includes(query)),
        ),
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const token = getAccessToken()
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }

      const data = await response.json()

      // Filter out users that are already in the chat
      const availableUsers = data.filter((user: User) => !existingParticipantIds.includes(user.id))
      setUsers(availableUsers)
      setFilteredUsers(availableUsers)
    } catch (err) {
      console.error("Error fetching users:", err)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    }
  }

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No users selected",
        description: "Please select at least one user to add",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onAddParticipants(selectedUsers)
      onOpenChange(false)
    } catch (err) {
      console.error("Error adding participants:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add Participants
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center border rounded-md px-3 py-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Search users..."
            className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredUsers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="select-all" className="text-sm cursor-pointer">
                  Select all
                </label>
              </div>
              <span className="text-xs text-muted-foreground">
                {selectedUsers.length} of {filteredUsers.length} selected
              </span>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleUserSelect(user.id)}
                    />
                    <label htmlFor={`user-${user.id}`} className="flex items-center space-x-3 flex-1 cursor-pointer">
                      <Avatar>
                        <AvatarImage src={user.profile_photo || "/placeholder.svg?height=40&width=40"} />
                        <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.fullname}</p>
                        {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No users available to add</p>
            {searchQuery && <p className="text-xs text-muted-foreground mt-2">No results found for "{searchQuery}"</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedUsers.length === 0 || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
