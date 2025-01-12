import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'
import SuggestionList from './SuggestionList'

export default {
  render: (suggestionsThemeName = 'suggestions') => {
    let component
    let popup

    const createPopup = clientRect => {
      const tippyOptions = {
        theme: suggestionsThemeName,
        getReferenceClientRect: clientRect,
        // May not be necessary, but feels better for Mobile at least
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: 'manual',
        arrow: false,
        offset: -10,
        placement: 'bottom-start'
      }

      if (suggestionsThemeName === 'suggestions-mobile') {
        // This handles the case of the Mobile Editor being in a container that is not
        // tall enought to accomodate suggestions. Adds padding while suggesting, removes
        // it on cancel or when a selection has been made.
        return tippy('body', {
          ...tippyOptions,
          onShown: () => {
            const suggestionsRoot = document.querySelector('[data-tippy-root]')
            const suggestionsHeight = parseInt(window.getComputedStyle(suggestionsRoot).height) || 0
            const proseMirrorElement = document.querySelector('.ProseMirror')
            const proseMirrorElementHeight = parseInt(window.getComputedStyle(proseMirrorElement).height)

            if (proseMirrorElementHeight < (suggestionsHeight + 50)) {
              const currentPaddingBottom = parseInt(proseMirrorElement.style.paddingBottom) || 0

              window.hyloEditorPaddingBottomOriginal = currentPaddingBottom
              proseMirrorElement.style.paddingBottom = currentPaddingBottom + suggestionsHeight + 'px'
            }
          },
          onHide: () => {
            if (
              typeof window.hyloEditorPaddingBottomOriginal !== 'undefined' &&
              window.hyloEditorPaddingBottomOriginal !== null
            ) {
              document.querySelector('.ProseMirror').style.paddingBottom = window.hyloEditorPaddingBottomOriginal + 'px'
            }
          }
        })
      }

      return tippy('body', tippyOptions)
    }

    return {
      onStart: props => {
        component = new ReactRenderer(SuggestionList, {
          props,
          editor: props.editor
        })

        if (!props.clientRect) {
          return
        }

        popup = createPopup(props.clientRect)
      },

      onUpdate (props) {
        if (!props.clientRect || !component) return

        component.updateProps(props)

        if (!popup || popup[0].state.isDestroyed) {
          popup = createPopup(props.clientRect)
        } else {
          popup[0].setProps({
            getReferenceClientRect: props.clientRect
          })
        }
      },

      onKeyDown (props) {
        if (props.event.key === 'Escape') {
          // Seems to be better to destroy and re-create in this case
          // popup[0].hide()
          this.onExit()

          return true
        }

        return component?.ref?.onKeyDown(props)
      },

      onExit () {
        // console.log('!!! Mention Plugin `suggestion.onExit()` called early?')
        popup && popup[0].destroy()
        component && component.destroy()
      }
    }
  }
}
