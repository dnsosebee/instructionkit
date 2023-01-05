import { NodeViewContent, NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { useState } from 'react'
import {
  useFlowtextContext,
  View,
} from '../../../../../components/views/app/project/flowchart/flowtext/flowtextProvider'

export const Group = (props: NodeViewProps) => {
  const context = useFlowtextContext()

  const isChart = context.view === View.Flowchart

  const [row, setRow] = useState(props.node.attrs.row)
  const [id, setId] = useState(props.node.attrs.id)

  console.log('ID!', props.node.attrs.id)

  const onRowCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Checkbox changed', e.target.checked)
    setRow(e.target.checked)
    props.updateAttributes({ row: e.target.checked })
  }

  const onIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('ID changed', e.target.innerText)
    setId(e.target.textContent)
    props.updateAttributes({ id: e.target.textContent })
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
        <div
          className={`flex relative rounded rounded border border-zinc-100 bg-zinc-50 pl-0.5 items-center ${
            row ? 'ml-1' : 'mt-1'
          }`}
        >
          <div className='absolute pl-1 pointer-events-none'>#</div>
          <div
            contentEditable='true'
            onInput={onIdChange}
            suppressContentEditableWarning={true}
            className={`pl-3 py-0.5 pr-1`}
          >
            {props.node.attrs.id}
          </div>
        </div>
      </div>
      <NodeViewContent
        className={`content grow ${row ? 'row' : 'column'}`}
        suppressContentEditableWarning={true}
      />
    </NodeViewWrapper>
  )
}

export default Group
