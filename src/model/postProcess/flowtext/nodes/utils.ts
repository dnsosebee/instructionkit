// utils to help make prosemirror easier

import { NodeViewProps } from '@tiptap/react'

// get the attributes on the parent Node of a custom NodeView
export const parentAttrs = (props: NodeViewProps) => {
  const resolvedPos = props.editor.state.doc.resolve(props.getPos())
  return resolvedPos.parent.attrs
}
