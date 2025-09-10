import { Extension } from '@tiptap/core'
import { PluginKey } from '@tiptap/pm/state'
import { ReactRenderer } from '@tiptap/react'
import Suggestion from '@tiptap/suggestion'
import tippy, { type Instance } from 'tippy.js'
import type { TagAttributes } from './tag-node'
import { TagSuggestionMenu } from './tag-suggestion-menu'

const createSuggestionConfig = (
  char: string,
  pluginName: string,
  tagType: TagAttributes['type']
) => ({
  char,
  pluginKey: new PluginKey(pluginName),
  startOfLine: false,
  command: ({ editor, range, props }: any) => {
    // Replace the range (including trigger character) with the tag node
    editor
      .chain()
      .focus()
      .deleteRange(range)
      .insertContent({
        type: 'tag',
        attrs: {
          id: props.id,
          type: props.type,
          label: props.label,
          value: props.value,
        },
      })
      .insertContent(' ') // Add a space after the tag to continue typing
      .run()
  },
  allow: ({ state, range }: any) => {
    const $from = state.doc.resolve(range.from)
    const type = state.schema.nodes.tag
    const allow = !!$from.parent.type.contentMatch.matchType(type)
    return allow
  },
  items: () => {
    // Return empty array - the component will handle data fetching
    return []
  },
  render: () => {
    let component: ReactRenderer<any, any>
    let popup: Instance[]

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(TagSuggestionMenu, {
          props: {
            ...props,
            triggerChar: char,
            tagType,
          },
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          maxWidth: 'none',
        })
      },

      onUpdate(props: any) {
        if (component) {
          component.updateProps({
            ...props,
            triggerChar: char,
            tagType,
          })
        }

        if (!props.clientRect) {
          return
        }

        if (popup && popup[0]) {
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        }
      },

      onKeyDown(props: any) {
        if (props.event.key === 'Escape') {
          if (popup && popup[0]) {
            popup[0].hide()
          }
          return true
        }

        return component?.ref?.onKeyDown(props)
      },

      onExit() {
        if (popup && popup[0]) {
          popup[0].destroy()
        }
        if (component) {
          component.destroy()
        }
      },
    }
  },
})

// Extension for Channels (Slack + HubSpot) with # trigger
export const ChannelExtensionWithData = Extension.create({
  name: 'channelWithData',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...createSuggestionConfig('#', 'channelSuggestionWithData', 'channel'),
      }),
    ]
  },
})

// Extension for Users with @ trigger
export const UserExtensionWithData = Extension.create({
  name: 'userWithData',
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...createSuggestionConfig('@', 'userSuggestionWithData', 'user'),
      }),
    ]
  },
})
