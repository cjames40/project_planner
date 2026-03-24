import { useState, useEffect } from 'react'
import { Modal } from '@/ui/components/Modal'
import { getApiKey, setApiKey, getModel, setModel } from '@/services/chat'

interface Props {
  open: boolean
  onClose: () => void
}

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']

export function SettingsModal({ open, onClose }: Props) {
  const [key, setKey] = useState('')
  const [model, setModelValue] = useState('gpt-4o')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (open) {
      setKey(getApiKey())
      setModelValue(getModel())
      setSaved(false)
    }
  }, [open])

  const handleSave = () => {
    setApiKey(key)
    setModel(model)
    setSaved(true)
    setTimeout(() => onClose(), 500)
  }

  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-300">OpenAI API Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-..."
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-zinc-500">
            Stored locally in your browser. Never sent to any server except OpenAI.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm text-zinc-300">Model</label>
          <select
            value={model}
            onChange={(e) => setModelValue(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && <span className="text-sm text-green-400">Saved!</span>}
          <button
            onClick={onClose}
            className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  )
}
