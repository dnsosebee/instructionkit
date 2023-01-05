import { Node, NodeProps } from 'reactflow'
import { StartFlow } from '../../../../../../model/schema/types/flow/types/start'
import { FlowShell } from './flowShell'

export type StartNodeData = { start: StartFlow }
export type StartNode = Node<StartNodeData> & { deletable: false }
export type StartProps = NodeProps<StartNodeData>

export const StartNode = ({
  data: {
    start: { id },
  },
  selected,
}: StartProps) => {
  return (
    <div>
      <p className='pl-3 bold text-zinc-50 font-extrabold text-4xl'>Start</p>
      <FlowShell {...{ id, selected, acceptsIncoming: false }}>
        <></>
      </FlowShell>
    </div>
  )
}
