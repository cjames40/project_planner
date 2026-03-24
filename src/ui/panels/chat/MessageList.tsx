import { useEffect, useRef } from 'react'
import { useChatStore } from '@/stores'

export function MessageList() {
  const { messages, isStreaming, streamingContent } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingContent])

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-sm text-zinc-500">
          Start a conversation to plan your project. Ask about risks, scope, architecture, or anything else.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-800 text-zinc-200'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        </div>
      ))}

      {isStreaming && streamingContent && (
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200">
            <p className="whitespace-pre-wrap">{streamingContent}</p>
            <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-zinc-400" />
          </div>
        </div>
      )}

      {isStreaming && !streamingContent && (
        <div className="flex justify-start">
          <div className="rounded-lg bg-zinc-800 px-4 py-2.5 text-sm text-zinc-400">
            <span className="animate-pulse">Thinking...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
