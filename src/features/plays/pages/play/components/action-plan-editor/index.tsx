import { useEffect } from 'react'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { parseContent } from './helpers'
import './styles.css'
import { ChannelExtensionWithData, UserExtensionWithData } from './tag-extensions'
import { TagNode } from './tag-node'

interface ActionPlanEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ActionPlanEditor({
  value = '',
  onChange,
  disabled = false,
}: ActionPlanEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Tag users with "@" or channels & lists with "#"',
      }),
      TagNode,
      ChannelExtensionWithData,
      UserExtensionWithData,
    ],
    content: parseContent(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Use double newline to separate paragraphs for proper preservation
      onChange?.(editor.getText({ blockSeparator: '\n\n' }))
    },
    editorProps: {
      attributes: {
        class: 'action-plan-editor prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentText = editor.getText({ blockSeparator: '\n\n' })
      if (value !== currentText) {
        editor.commands.setContent(parseContent(value))
      }
    }
  }, [value, editor])

  return (
    <div className='relative rounded-md border'>
      <EditorContent editor={editor} />
    </div>
  )
}

export default ActionPlanEditor
