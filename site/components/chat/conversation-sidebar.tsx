"use client"

import { useState } from "react"
import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, MessageSquare, Trash2, Edit, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ConversationSidebar() {
  const {
    conversations,
    conversationId,
    createNewConversation,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
  } = useChat()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingId(id)
    setEditTitle(currentTitle)
  }

  const handleSaveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await updateConversationTitle(id, editTitle)
      setEditingId(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <div className="w-64 h-full bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <Button
          onClick={() => createNewConversation()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Conversation
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                className={`rounded-md p-2 ${
                  conversationId === conversation._id ? "bg-gray-800" : "hover:bg-gray-800/50"
                }`}
              >
                {editingId === conversation._id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleSaveEdit(conversation._id)}
                      className="h-6 w-6"
                    >
                      <Check className="h-4 w-4 text-emerald-500" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-6 w-6">
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <button
                      className="flex items-center gap-2 text-sm text-left flex-1 truncate"
                      onClick={() => loadConversation(conversation._id)}
                    >
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="truncate">{conversation.title}</span>
                    </button>

                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(conversation._id, conversation.title)
                        }}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      >
                        <Edit className="h-3 w-3 text-gray-400" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteConversation(conversation._id)
                        }}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3 w-3 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                )}

                {!editingId && (
                  <div className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
