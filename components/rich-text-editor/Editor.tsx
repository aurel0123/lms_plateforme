import React from 'react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { MenuBar } from './menu-bar'
import { StarterKit } from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import FileHandler from '@tiptap/extension-file-handler'

export default function RichTextEditor({field} : {field : any }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Image,
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: {},
        orderedList: {},
      }),
      
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      FileHandler.configure({
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
        onDrop: (currentEditor, files, pos) => {
          files.forEach(file => {
            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(pos, {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run()
            }
          })
        },
        onPaste: (currentEditor, files, htmlContent) => {
          files.forEach(file => {
            if (htmlContent) {
              // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
              // you could extract the pasted file from this url string and upload it to a server for example
              console.log(htmlContent) // eslint-disable-line no-console
              return false
            }

            const fileReader = new FileReader()

            fileReader.readAsDataURL(file)
            fileReader.onload = () => {
              currentEditor
                .chain()
                .insertContentAt(currentEditor.state.selection.anchor, {
                  type: 'image',
                  attrs: {
                    src: fileReader.result,
                  },
                })
                .focus()
                .run()
            }
          })
        },
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
