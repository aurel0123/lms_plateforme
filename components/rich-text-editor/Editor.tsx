import React from 'react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { MenuBar } from './menu-bar'
import { StarterKit } from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'

export default function RichTextEditor({field} : {field : any }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    editorProps: {
      attributes: {
        class : 'min-h-[250px] focus:outline-none p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none'
      },
    },

    onUpdate : ({editor}) => {
      field.onChange(JSON.stringify(editor.getJSON())) ; 
    },
    content : field.Value ? JSON.parse(field.Value) : '<p>Hello world </p>'
  })

  return (
    <div className='border border-input rounded-lg w-full dark:bg-input/30 overflow-hidden'>
      <MenuBar editor={editor}/>
      <EditorContent editor={editor} />
    </div>
  )
}
