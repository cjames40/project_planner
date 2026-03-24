import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { ProposedCard } from './ProposedCard'
import { useChatStore } from '@/stores'

export function ChatPanel() {
  const { pendingProposals, error } = useChatStore()
  const pendingItems = pendingProposals
    .map((p, i) => ({ ...p, index: i }))
    .filter((p) => p.status === 'pending')

  return (
    <div className="flex h-full flex-col bg-zinc-950">
      <div className="border-b border-zinc-700 px-4 py-2.5">
        <h3 className="text-sm font-medium text-zinc-300">Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>

      {pendingItems.length > 0 && (
        <div className="border-t border-zinc-700 p-3 space-y-2">
          {pendingItems.map((p) => (
            <ProposedCard key={p.index} proposal={p} index={p.index} />
          ))}
        </div>
      )}

      {error && (
        <div className="border-t border-red-900 bg-red-950/50 px-4 py-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      <ChatInput />
    </div>
  )
}
