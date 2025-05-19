import SynaptiqChat from "@/components/chat/synaptiq-chat"
import { ApiStatusChecker } from "@/components/api-status-checker"

export default function ChatPage() {
  return (
    <>
      <SynaptiqChat />
      <ApiStatusChecker />
    </>
  )
}
