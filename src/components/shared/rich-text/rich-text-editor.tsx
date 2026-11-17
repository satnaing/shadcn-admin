import { useEffect, useState } from 'react'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useTranslation } from 'react-i18next'
import { MediaLibraryDialog } from '../media/media-library-dialog'
import { isEmptyHtml, sanitizeHtml } from './rich-text.logic'
import { RichTextToolbar } from './rich-text-toolbar'

export interface RichTextEditorProps {
  /** HTML. */
  value: string
  onChange: (html: string) => void
  placeholder?: string
  readOnly?: boolean
  /** Character limit shown under the editor (text length, not HTML). */
  limit?: number
  id?: string
}

const CONTENT_CLASS =
  'min-h-32 px-3 py-2 text-sm outline-none [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:font-semibold [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:ps-5 [&_ol]:ps-5 [&_a]:text-primary [&_a]:underline [&_blockquote]:border-s-2 [&_blockquote]:ps-3 [&_img]:max-h-48'

/** Sanitized HTML of the editor, '' when it only holds an empty paragraph. */
const output = (html: string) => (isEmptyHtml(html) ? '' : sanitizeHtml(html))

/** TipTap editor: headings, bold/italic, lists, quote, link, image (media library). Emits sanitized HTML. */
export function RichTextEditor({ value, onChange, placeholder, readOnly, limit, id }: RichTextEditorProps) {
  const { t } = useTranslation('common')
  const [library, setLibrary] = useState(false)
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false },
        underline: false,
        strike: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Image,
      Placeholder.configure({ placeholder: placeholder ?? '' }),
      CharacterCount.configure({ limit }),
    ],
    content: value,
    editable: !readOnly,
    editorProps: { attributes: { id: id ?? '', class: CONTENT_CLASS } },
    onUpdate: ({ editor: e }) => onChange(output(e.getHTML())),
  })

  // External value changes (form reset, locale switch) → editor; our own output echoing back is skipped.
  useEffect(() => {
    if (editor && value !== output(editor.getHTML())) editor.commands.setContent(value, { emitUpdate: false })
  }, [value, editor])
  useEffect(() => {
    editor?.setEditable(!readOnly)
  }, [editor, readOnly])

  if (!editor) return null

  return (
    <div className='rounded-md border focus-within:ring-[3px] focus-within:ring-ring/50'>
      {!readOnly && <RichTextToolbar editor={editor} onImage={() => setLibrary(true)} />}
      <EditorContent editor={editor} />
      {limit && (
        <p className='px-3 pb-1 text-end text-xs text-muted-foreground'>
          {t('richText.count', { count: editor.storage.characterCount.characters(), limit })}
        </p>
      )}
      {library && (
        <MediaLibraryDialog
          open
          onOpenChange={setLibrary}
          accept='image'
          multiple={false}
          initial={[]}
          onConfirm={([file]) => file && editor.chain().focus().setImage({ src: file.url, alt: file.name }).run()}
        />
      )}
    </div>
  )
}
