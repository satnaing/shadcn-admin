import type { Editor } from '@tiptap/react'
import { Bold, Heading2, Heading3, ImagePlus, Italic, Link2, List, ListOrdered, Quote, Unlink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Toggle } from './toggle-button'

interface Props {
  editor: Editor
  onImage: () => void
}

/** Heading, bold/italic, lists, quote, link, image. */
export function RichTextToolbar({ editor, onImage }: Props) {
  const { t } = useTranslation('common')
  const run = () => editor.chain().focus()
  const link = () => {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt(t('richText.linkPrompt'), prev ?? 'https://')
    if (url === null) return
    if (url.trim() === '') run().unsetLink().run()
    else run().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  return (
    <div className='flex flex-wrap gap-0.5 border-b p-1' role='toolbar' aria-label={t('richText.toolbar')}>
      <Toggle label={t('richText.h2')} active={editor.isActive('heading', { level: 2 })} onClick={() => run().toggleHeading({ level: 2 }).run()}><Heading2 /></Toggle>
      <Toggle label={t('richText.h3')} active={editor.isActive('heading', { level: 3 })} onClick={() => run().toggleHeading({ level: 3 }).run()}><Heading3 /></Toggle>
      <Toggle label={t('richText.bold')} active={editor.isActive('bold')} onClick={() => run().toggleBold().run()}><Bold /></Toggle>
      <Toggle label={t('richText.italic')} active={editor.isActive('italic')} onClick={() => run().toggleItalic().run()}><Italic /></Toggle>
      <Toggle label={t('richText.bullets')} active={editor.isActive('bulletList')} onClick={() => run().toggleBulletList().run()}><List /></Toggle>
      <Toggle label={t('richText.numbers')} active={editor.isActive('orderedList')} onClick={() => run().toggleOrderedList().run()}><ListOrdered /></Toggle>
      <Toggle label={t('richText.quote')} active={editor.isActive('blockquote')} onClick={() => run().toggleBlockquote().run()}><Quote /></Toggle>
      <Toggle label={t('richText.link')} active={editor.isActive('link')} onClick={link}><Link2 /></Toggle>
      {editor.isActive('link') && <Toggle label={t('richText.unlink')} onClick={() => run().unsetLink().run()}><Unlink /></Toggle>}
      <Toggle label={t('richText.image')} onClick={onImage}><ImagePlus /></Toggle>
    </div>
  )
}
