"use client"

import { useChat } from "@/contexts/chat-context"
import { Button } from "@/components/ui/button"
import { ScientificLogo } from "@/components/scientific-logo"
import { Trash2, Settings, HelpCircle, User, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ChatHeaderProps {
  onToggleSidebar: () => void
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  const { clearChat, queriesRemaining, isGuest } = useChat()

  return (
    <header className="border-b border-gray-800 bg-[#0a0a0a]/90 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/50 sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <ScientificLogo className="h-6 w-6 text-white" />
          <span className="font-bold text-white">Synaptiq Chat</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {isGuest ? (
              <span>Guest • {queriesRemaining}/3 queries left</span>
            ) : (
              <span>Researcher • {queriesRemaining}/10 queries left</span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-gray-800">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-white">
              <DropdownMenuItem onClick={clearChat} className="hover:bg-gray-800 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear chat</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-gray-800" />

              {isGuest ? (
                <DropdownMenuItem asChild>
                  <Link href="/login" className="hover:bg-gray-800">
                    Log in
                  </Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/account" className="hover:bg-gray-800">
                    Account
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link href="/settings" className="hover:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/help" className="hover:bg-gray-800">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
