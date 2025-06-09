// Type definitions for posts, comments and reactions

// Post Types*
export type ReactionType = "Like" | "Love" | "Haha" | "Wow" | "Sad" | "Angry"

export interface Post {
  id: string
  content: string
  media?: PostMedia[] // Corrected to array of PostMedia
  authorId: string
  user?: {
    id: string
    fullname: string
    profile_photo: string
  }
  author?: {
    id: string
    name: string
    username?: string
    avatar: string
  }
  likes?: number
  likeCount?: number
  comments?: number
  commentCount?: number
  shares?: number
  shareCount?: number
  createdAt: string
  updatedAt?: string
  userReaction?: string
}

export interface PostMedia {
  id: string
  type: string
  url: string
  fileName?: string
  fileSize?: number
  width?: number
  height?: number
  duration?: number
  postId: string
}

export interface CreatePostDTO {
  content: string
}

export interface UpdatePostDTO {
  content?: string
}

// Comment Types
export interface Comment {
  id: string
  content: string
  userId: string
  postId: string
  parentId?: string // Optional, used for replies
  createdAt: string
  updatedAt: string
  author: {
    // Rename `user` to `author`
    id: string
    fullname: string
    profile_photo: string | null
  }
  reactionCount: {
    like: number
    love: number
    haha: number
    wow: number
    sad: number
    angry: number
  }
  userReaction?: string // Optional, tracks the current user's reaction
  replyCount: number // Number of replies
  replies?: Comment[] // Nested replies (child comments)
}

export interface CreateCommentDTO {
  content: string
  parentId?: string
  // Remove the index signature and add specific properties
  userId: string
  postId: string
}

export interface UpdateCommentDTO {
  content: string
}

// Reaction Types
export interface CreateReactionDTO {
  userId: string
  type: ReactionType
}


export interface Reaction {
  id: string
  type: ReactionType
  userId: string
  postId?: string
  commentId?: string
  createdAt: string
}
// types/message.ts


// In your frontend, create a shared types file (e.g., types/message.ts)
export type MessageStatus = 'SENDING' | 'SENT' | 'DELIVERED' | 'SEEN' | 'FAILED' | 'EDITED';

export interface Message {
  id: string
  content: string
  type: "TEXT" | "IMAGE" | "FILE" | "VOICE" | "CALL"
  status: "SENDING" | "SENT" | "DELIVERED" | "SEEN" | "FAILED" | "EDITED"
  chatId: string
  userId: string
  createdAt: string
  updatedAt: string
  attachment?: {
    id: string
    url: string
    type: string
    fileName: string
    fileSize: number
    width?: number
    height?: number
    duration?: number
  }[]
  sender: {
    id: string
    fullname: string
    profile_photo?: string
  }
}
export interface Chat {
  id: string
  name: string | null
  isGroup: boolean
  adminId: string | null
  createdAt: string
  updatedAt: string
  users: ChatParticipant[]
  messages: Message[]
}

export interface ChatParticipant {
  userId: string
  chatId: string
  joinedAt: string
  user: {
    id: string
    fullname: string
    profile_photo?: string
  }
}

// API Functions
export async function fetchChats() {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`Failed to fetch chats: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching chats:", error)
    throw error
  }
}

export async function fetchChat(chatId: string) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`Failed to fetch chat: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching chat:", error)
    throw error
  }
}

export async function createChat(userIds: string[], isGroup: boolean = false, name?: string) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userIds, isGroup, name }),
    })

    if (!response.ok) throw new Error(`Failed to create chat: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error creating chat:", error)
    throw error
  }
}

export async function addChatParticipants(chatId: string, userIds: string[]) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${chatId}/participants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userIds }),
    })

    if (!response.ok) throw new Error(`Failed to add participants: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error adding participants:", error)
    throw error
  }
}

export async function deleteChat(chatId: string) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/chats/${chatId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`Failed to delete chat: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error deleting chat:", error)
    throw error
  }
}





export async function sendMessage(chatId: string, content: string, type: string = "TEXT", file?: File) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const formData = new FormData()
    formData.append("chatId", chatId)
    formData.append("content", content)
    formData.append("type", type)

    if (file) {
      formData.append("file", file)
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) throw new Error(`Failed to send message: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error sending message:", error)
    throw error
  }
}

export async function fetchMessages(chatId: string) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/chat/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

export async function deleteMessage(messageId: string, forEveryone: boolean = false) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${messageId}?forEveryone=${forEveryone}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) throw new Error(`Failed to delete message: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error deleting message:", error)
    throw error
  }
}

export async function editMessage(messageId: string, content: string) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/${messageId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    })

    if (!response.ok) throw new Error(`Failed to edit message: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error editing message:", error)
    throw error
  }
}

export async function markMessageAsRead(messageId: string) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/read/${messageId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) throw new Error(`Failed to mark message as read: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error marking message as read:", error)
    throw error
  }
}

export async function startCall(chatId: string, isVideo: boolean) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/call/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, isVideo }),
    })

    if (!response.ok) throw new Error(`Failed to start call: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error starting call:", error)
    throw error
  }
}

export async function endCall(callId: string, duration: number) {
  try {
    const token = localStorage.getItem("access_token")
    if (!token) throw new Error("Authentication required")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/call/end/${callId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ duration }),
    })

    if (!response.ok) throw new Error(`Failed to end call: ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error("Error ending call:", error)
    throw error
  }
}











/**
 * API service for habit tracking application
 * Uses the NEXT_PUBLIC_BACKEND_URL environment variable
 */

// Types
// Types
// Types
export interface Habit {
  id: string
  userId: string
  name: string
  type: "GoodHabit" | "BadHabit"
  description?: string
  weeklyTarget: number
  status: "NotStarted" | "InProgress" | "Paused" | "Completed"
  streak: number
  createdAt: string
  updatedAt: string
  completions?: HabitCompletion[]
}

export interface HabitCompletion {
  id: string
  habitId: string
  date: string
  completed: boolean
  notes?: string
}

export interface CreateHabitDto {
  name: string
  description?: string
  type: "GoodHabit" | "BadHabit"
  weeklyTarget?: number
  status?: "NotStarted" | "InProgress" | "Paused" | "Completed"
}

export interface WeeklySummary {
  summary: string
  generatedAt: string
}

// API base URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

// Helper function for API requests
async function apiRequest<T>(endpoint: string, method = "GET", data?: any): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Add authorization header if token exists (try both possible token names)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("access_token") : null

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (data) {
    options.body = JSON.stringify(data)
  }

  try {
    console.log(`Making ${method} request to: ${url}`)
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    // For DELETE requests that don't return data
    if (method === "DELETE" && response.status === 204) {
      return {} as T
    }

    return await response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  // Add authorization header if token exists (try both possible token names)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("access_token") : null

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}

/**
 * Fetches the weekly summary for the current user
 * @returns {Promise<string>} The weekly summary text
 */
export async function fetchWeeklySummary(): Promise<string> {
  try {
    // Updated to match the backend endpoint
    const response = await fetch(`${API_URL}/habits/weekly-summary`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // If we get a 404, return a mock summary for development
      if (response.status === 404) {
        console.warn("Weekly summary endpoint not found, using mock data")
        return generateMockSummary()
      }
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: WeeklySummary = await response.json()
    return data.summary
  } catch (error) {
    console.error("Failed to fetch weekly summary:", error)
    // Return mock data in case of error for better user experience during development
    return generateMockSummary()
  }
}

/**
 * Regenerates the weekly summary for the current user
 * @returns {Promise<string>} The newly generated weekly summary text
 */
export async function regenerateWeeklySummary(): Promise<string> {
  try {
    // Since there's no specific regenerate endpoint in the controller,
    // we'll just call the same endpoint again
    const response = await fetch(`${API_URL}/habits/weekly-summary`, {
      method: "GET", // Using GET since that's what the controller expects
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // If we get a 404, return a mock summary for development
      if (response.status === 404) {
        console.warn("Weekly summary endpoint not found, using mock data")
        return generateMockSummary(true)
      }
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data: WeeklySummary = await response.json()
    return data.summary
  } catch (error) {
    console.error("Failed to regenerate weekly summary:", error)
    // Return mock data in case of error for better user experience during development
    return generateMockSummary(true)
  }
}

/**
 * Generates a mock summary for development and testing
 * This simulates what the AI would generate
 */
function generateMockSummary(isRegenerated = false): string {


  const tips = [
    "• Essayez de compléter votre habitude de méditation plus tôt dans la journée pour augmenter votre concentration. 🧘",
    "• Votre habitude de lecture montre une tendance positive. Augmentez progressivement votre objectif de 5 minutes par semaine. 📚",
    "• Les jours où vous faites de l'exercice, vous êtes 30% plus susceptible de compléter vos autres habitudes. Priorisez cette habitude. 💪",
    "• Considérez regrouper certaines habitudes en une routine du matin pour améliorer votre taux de réussite. ⏰",
    "• Votre habitude la moins performante est 'Boire 2L d'eau'. Essayez de placer des rappels visuels dans votre environnement. 💧",
    "• Les weekends montrent une baisse de 20% dans la complétion des habitudes. Créez une routine de weekend spécifique et plus légère. 🏖️",
  ]

  const quotes = [
    "\"Les habitudes sont d'abord des toiles d'araignées, puis des câbles.\" - Proverbe espagnol 🕸️",
    "\"Nous sommes ce que nous faisons de manière répétée. L'excellence n'est donc pas un acte, mais une habitude.\" - Aristote 🏆",
    "\"Le succès n'est pas toujours une question de grandeur. C'est une question de cohérence. Un travail acharné et constant gagne du succès.\" - Dwayne Johnson 💯",
  ]

  // Select random elements
  

  // Select 3-4 random tips
  const selectedTips = []
  const tipsCopy = [...tips]
  const tipCount = Math.floor(Math.random() * 2) + 3 // 3-4 tips
  for (let i = 0; i < tipCount; i++) {
    if (tipsCopy.length === 0) break
    const index = Math.floor(Math.random() * tipsCopy.length)
    selectedTips.push(tipsCopy[index])
    tipsCopy.splice(index, 1)
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  // Add a regeneration message if this is a regenerated summary
  const regenerationNote = isRegenerated
    ? "\n\nCe résumé a été régénéré avec une nouvelle analyse de vos données d'habitudes. ✨"
    : ""

  // Combine all parts
  return `${selectedTips.join("\n")}\n\n${quote}${regenerationNote}`
}

// Habit API functions
export const habitApi = {
  // Get all habits
  getAll: async (): Promise<Habit[]> => {
    return apiRequest<Habit[]>("/habits")
  },

  // Get a single habit by ID
  getById: async (id: string): Promise<Habit> => {
    return apiRequest<Habit>(`/habits/${id}`)
  },

  // Create a new habit
  create: async (habit: CreateHabitDto): Promise<Habit> => {
    return apiRequest<Habit>("/habits", "POST", habit)
  },

  // Update a habit
  update: async (id: string, habit: Partial<CreateHabitDto>): Promise<Habit> => {
    return apiRequest<Habit>(`/habits/${id}`, "PATCH", habit)
  },

  // Update habit status
  updateStatus: async (id: string, status: Habit["status"]): Promise<Habit> => {
    return apiRequest<Habit>(`/habits/${id}/status`, "PATCH", { status })
  },

  // Record habit completion
  recordCompletion: async (id: string, completed: boolean, notes?: string): Promise<HabitCompletion> => {
    return apiRequest<HabitCompletion>(`/habits/${id}/completion`, "POST", { completed, notes })
  },

  // Delete a habit
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/habits/${id}`, "DELETE")
  },
}

// Fonction pour formater la plage de dates
export function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }
  const start = startDate.toLocaleDateString("fr-FR", options)
  const end = endDate.toLocaleDateString("fr-FR", options)
  return `${start} - ${end}`
}
