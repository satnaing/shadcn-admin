import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
  placeholder = 'Type "#" for channels or "@" for users...',
  disabled = false,
}: ActionPlanEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, TagNode, ChannelExtensionWithData, UserExtensionWithData],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
      },
    },
  })

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className='relative rounded-md border'>
      <EditorContent editor={editor} />
      {editor?.isEmpty && (
        <div className='text-muted-foreground pointer-events-none absolute top-4 left-4'>
          {placeholder}
        </div>
      )}
    </div>
  )
}

export default ActionPlanEditor
