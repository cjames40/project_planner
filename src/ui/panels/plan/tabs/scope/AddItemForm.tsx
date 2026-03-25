import { useState, type ReactNode } from 'react'

interface AddItemFormProps {
  fields: {
    key: string
    label: string
    type: 'text' | 'textarea' | 'select' | 'checkbox'
    required?: boolean
    placeholder?: string
    options?: { value: string; label: string }[]
  }[]
  onSubmit: (values: Record<string, string | boolean>) => void
  onCancel: () => void
  submitLabel?: string
}

export function AddItemForm({ fields, onSubmit, onCancel, submitLabel = 'Add' }: AddItemFormProps) {
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const init: Record<string, string | boolean> = {}
    fields.forEach((f) => {
      init[f.key] = f.type === 'checkbox' ? false : ''
    })
    return init
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    fields.forEach((f) => {
      if (f.required && f.type !== 'checkbox' && !(values[f.key] as string)?.trim()) {
        errs[f.key] = `${f.label} is required`
      }
    })
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit(values)
  }

  const set = (key: string, val: string | boolean) => {
    setValues((v) => ({ ...v, [key]: val }))
    setErrors((e) => { const n = { ...e }; delete n[key]; return n })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded border border-zinc-700 bg-zinc-900 p-3">
      {fields.map((f) => (
        <div key={f.key}>
          {f.type === 'checkbox' ? (
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={values[f.key] as boolean}
                onChange={(e) => set(f.key, e.target.checked)}
                className="rounded border-zinc-600"
              />
              {f.label}
            </label>
          ) : (
            <>
              <label className="mb-1 block text-xs text-zinc-400">{f.label}{f.required ? ' *' : ''}</label>
              {f.type === 'textarea' ? (
                <textarea
                  value={values[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={2}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                />
              ) : f.type === 'select' ? (
                <select
                  value={values[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select...</option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[f.key] as string}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none"
                />
              )}
            </>
          )}
          {errors[f.key] && <p className="mt-0.5 text-xs text-red-400">{errors[f.key]}</p>}
        </div>
      ))}
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="rounded px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200">
          Cancel
        </button>
      </div>
    </form>
  )
}
