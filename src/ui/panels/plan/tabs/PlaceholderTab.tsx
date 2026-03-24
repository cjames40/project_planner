interface Props {
  name: string
}

export function PlaceholderTab({ name }: Props) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-zinc-500">
        {name} tab coming soon. Use the chat to discuss {name.toLowerCase()}.
      </p>
    </div>
  )
}
