import type { Message } from "@/types/chat"

// Define the Conversation interface
export interface Conversation {
  _id: string
  userId: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// In-memory storage
let conversations: Conversation[] = []

// Initialize from localStorage if available
if (typeof window !== "undefined") {
  try {
    const storedConversations = localStorage.getItem("synaptiq-conversations")
    if (storedConversations) {
      const parsed = JSON.parse(storedConversations)
      // Convert string dates back to Date objects
      conversations = parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
    }
  } catch (error) {
    console.error("Error loading conversations from localStorage:", error)
  }
}

// Helper to save to localStorage
const saveToStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("synaptiq-conversations", JSON.stringify(conversations))
    } catch (error) {
      console.error("Error saving conversations to localStorage:", error)
    }
  }
}

// Collection operations
export const conversationsCollection = {
  findOne: async ({ _id }: { _id: string }): Promise<Conversation | null> => {
    return conversations.find((conv) => conv._id === _id) || null
  },

  find: ({ userId }: { userId: string }) => ({
    sort: ({ updatedAt }: { updatedAt: number }) => ({
      toArray: async (): Promise<Conversation[]> => {
        const userConvs = conversations.filter((conv) => conv.userId === userId)
        return updatedAt === -1 ? userConvs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()) : userConvs
      },
    }),
  }),

  findOneAndUpdate: async (
    query: { _id: string },
    update: any,
    options: { returnDocument: string },
  ): Promise<Conversation | null> => {
    const index = conversations.findIndex((conv) => conv._id === query._id)
    if (index === -1) return null

    const conversation = conversations[index]

    // Handle $push operation
    if (update.$push?.messages) {
      conversation.messages.push(update.$push.messages)
    }

    // Handle $set operation
    if (update.$set) {
      Object.assign(conversation, update.$set)
    }

    conversations[index] = conversation
    saveToStorage()
    return conversation
  },

  insertOne: async (doc: Conversation): Promise<{ insertedId: string }> => {
    conversations.push(doc)
    saveToStorage()
    return { insertedId: doc._id }
  },

  deleteOne: async ({ _id }: { _id: string }): Promise<{ deletedCount: number }> => {
    const initialLength = conversations.length
    conversations = conversations.filter((conv) => conv._id !== _id)
    saveToStorage()
    return { deletedCount: initialLength - conversations.length }
  },
}
