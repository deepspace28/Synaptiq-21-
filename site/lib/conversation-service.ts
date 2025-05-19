import { nanoid } from "nanoid"
import { conversationsCollection, type Conversation } from "./storage"
import type { Message } from "@/types/chat"

export type { Conversation } from "./storage"

export async function createConversation(userId: string): Promise<Conversation> {
  try {
    const conversation: Conversation = {
      _id: nanoid(),
      userId,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await conversationsCollection.insertOne(conversation)
    return conversation
  } catch (error) {
    console.error("Error creating conversation:", error)
    // Return a fallback conversation
    return {
      _id: nanoid(),
      userId,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
}

export async function getConversation(conversationId: string): Promise<Conversation | null> {
  try {
    return await conversationsCollection.findOne({ _id: conversationId })
  } catch (error) {
    console.error(`Error getting conversation ${conversationId}:`, error)
    return null
  }
}

export async function getUserConversations(userId: string): Promise<Conversation[]> {
  try {
    return await conversationsCollection.find({ userId }).sort({ updatedAt: -1 }).toArray()
  } catch (error) {
    console.error(`Error getting user conversations for ${userId}:`, error)
    return []
  }
}

export async function addMessageToConversation(conversationId: string, message: Message): Promise<Conversation | null> {
  try {
    const result = await conversationsCollection.findOneAndUpdate(
      { _id: conversationId },
      {
        $push: { messages: message },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" },
    )

    return result
  } catch (error) {
    console.error(`Error adding message to conversation ${conversationId}:`, error)
    return null
  }
}

export async function updateConversationTitle(conversationId: string, title: string): Promise<Conversation | null> {
  try {
    const result = await conversationsCollection.findOneAndUpdate(
      { _id: conversationId },
      { $set: { title, updatedAt: new Date() } },
      { returnDocument: "after" },
    )

    return result
  } catch (error) {
    console.error(`Error updating conversation title ${conversationId}:`, error)
    return null
  }
}

export async function deleteConversation(conversationId: string): Promise<boolean> {
  try {
    const result = await conversationsCollection.deleteOne({ _id: conversationId })
    return result.deletedCount === 1
  } catch (error) {
    console.error(`Error deleting conversation ${conversationId}:`, error)
    return false
  }
}
