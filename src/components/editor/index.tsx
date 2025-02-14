import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
// import BulletList from '@tiptap/extension-bullet-list'
// import Document from '@tiptap/extension-document'
// import ListItem from '@tiptap/extension-list-item'
// import Paragraph from '@tiptap/extension-paragraph'
// import Text from '@tiptap/extension-text'

// define your extension array
const extensions = [StarterKit]

const content = '<p>Hello World!</p>'

const TiptapEditor = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: 'padding-left: 56px; padding-right: 56px;',
        class: 'focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text text-gray-800',
      },
    },
    extensions,
    content,
  })

  return (
    <div className='size-full overflow-x-auto px-4 print:p-0 print:bg-white print:overflow-visible'>
      <div className='min-w-max flex justify-center w-[800px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
        <EditorContent editor={editor} />
        <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
        <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu>
      </div>
    </div>
  )
}

export default TiptapEditor
