import { TagView } from './action-plan-editor/tag-view'

interface ActionPlanDisplayProps {
  text: string
  className?: string
}

export function ActionPlanDisplay({ text, className }: ActionPlanDisplayProps) {
  if (!text) return null

  const parts = text.split(/(\$\{[^}]+\}\$)/g)

  return (
    <span className={className}>
      {parts.map((part, index) => {
        // Check if this part is a tag
        const tagMatch = part.match(/^\$\{([^:]+):([^:}]+)(?::([^}]+))?\}\$$/)

        if (tagMatch) {
          const [, type, value, label] = tagMatch
          const displayLabel = label || value

          // Map the type to the correct format and determine subtype
          const tagType = type === 'slack-channel' || type === 'hubspot-list' ? 'channel' : type
          const subtype = type === 'slack-channel' || type === 'hubspot-list' ? type : undefined

          return (
            <TagView
              key={index}
              type={tagType as any}
              label={displayLabel}
              subtype={subtype as any}
              className='mx-0.5 px-1.5'
            />
          )
        }

        return <span key={index}>{part}</span>
      })}
    </span>
  )
}
