import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { NodeViewWrapper } from '@tiptap/react'
import { TagView } from './tag-view'

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

  return (
    <NodeViewWrapper as='span' className='inline-block'>
      <TagView type={type} label={label} subtype={subtype} />
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

  renderText({ node }) {
    const { type, value, subtype, label } = node.attrs
    // Use subtype if available (for grouped channels), otherwise use type
    const variableType = subtype || type
    // Include the label (display name) in the saved format
    return `\${${variableType}:${value}:${label}}$`
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
