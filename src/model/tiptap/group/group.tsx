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
    <NodeViewWrapper
      className={`group grow rounded p-0 bg-zinc-50 ${row ? '' : 'flex'}`}
      row={row.toString()}
    >
      <div
        className={`options flex items-center bg-zinc-100 rounded text-xs text-gray-500 ${
          row ? 'mb-1' : 'flex flex-col mr-1'
        }`}
        contentEditable='false'
      >
        <input type='checkbox' className={`rounded`} onChange={onRowCheckboxChange} checked={row} />
      </div>
      <NodeViewContent
        className={`content grow ${row ? 'row' : 'column'}`}
        suppressContentEditableWarning={true}
      />
    </NodeViewWrapper>
  )
}

export default Group
