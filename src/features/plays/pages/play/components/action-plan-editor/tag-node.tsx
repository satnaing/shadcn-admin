import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { Hash, User, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TagAttributes {
  id: string
  type: 'slack-channel' | 'user' | 'hubspot-list' | 'channel'
  label: string
  value: string
  subtype?: 'slack-channel' | 'hubspot-list' // For grouped channels
}

// React component for rendering the tag
function TagComponent({ node }: any) {
  const { type, label, subtype } = node.attrs as TagAttributes

  const getIcon = () => {
    if (type === 'channel') {
      // For the new grouped channel type, use subtype to determine icon
      return subtype === 'hubspot-list' ? (
        <List className='h-3 w-3' />
      ) : (
        <Hash className='h-3 w-3' />
      )
    }

    switch (type) {
      case 'slack-channel':
        return <Hash className='h-3 w-3' />
      case 'user':
        return <User className='h-3 w-3' />
      case 'hubspot-list':
        return <List className='h-3 w-3' />
      default:
        return <Hash className='h-3 w-3' />
    }
  }

  const getColorClass = () => {
    if (type === 'channel') {
      // For the new grouped channel type, use subtype to determine color
      return subtype === 'hubspot-list'
        ? 'bg-orange-100 text-orange-800 border-orange-200'
        : 'bg-purple-100 text-purple-800 border-purple-200'
    }

    switch (type) {
      case 'slack-channel':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'hubspot-list':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200'
    }
  }

  return (
    <NodeViewWrapper
      as='span'
      className={cn(
        'mx-1 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
        'cursor-default',
        getColorClass()
      )}
    >
      {getIcon()}
      <span>{label}</span>
    </NodeViewWrapper>
  )
}

// TipTap Node definition
export const TagNode = Node.create({
  name: 'tag',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  draggable: false,
  addAttributes() {
    return {
      id: {
        default: null,
      },
      type: {
        default: 'channel',
      },
      label: {
        default: '',
      },
      value: {
        default: '',
      },
      subtype: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="tag"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ 'data-type': 'tag' }, HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TagComponent)
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => {
        const { state } = this.editor
        const { selection } = state
        const { empty, $anchor } = selection

        if (!empty) {
          return false
        }

        const pos = $anchor.pos
        const node = state.doc.nodeAt(pos - 1)

        if (node && node.type.name === 'tag') {
          const nodeSize = node.nodeSize
          return this.editor.commands.deleteRange({
            from: pos - nodeSize,
            to: pos,
          })
        }

        return false
      },
    }
  },
})
