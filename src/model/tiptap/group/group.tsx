import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import { useFlowtextContext, View } from '../../../components/floem/flowtextProvider'

export const Group = (props: NodeViewProps) => {
  const context = useFlowtextContext()

  const isChart = context.view === View.Flowchart

  const [row, setRow] = useState(props.node.attrs.row)

  const onRowCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Checkbox changed', e.target.checked)
    setRow(e.target.checked)
    props.updateAttributes({ row: e.target.checked })
  }

  return (
    <NodeViewWrapper className={`group rounded p-0`} row={row.toString()}>
      <div
        className={`options flex items-center bg-gray-200 rounded mb-1 p-1 text-xs text-gray-500`}
        contentEditable='false'
      >
        Row
        <input type='checkbox' className={`ml-1`} onChange={onRowCheckboxChange} checked={row} />
      </div>
      <NodeViewContent
        className={`content ${row ? 'row' : 'column'}`}
        suppressContentEditableWarning={true}
      />
    </NodeViewWrapper>
  )
}

export default Group
