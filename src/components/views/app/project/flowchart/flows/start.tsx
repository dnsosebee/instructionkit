import { Node, NodeProps } from 'reactflow'
import { StartFlow } from '../../../../../../model/replicache/spaces/proj/entries/flow/types/start'
import { Branch } from './branch'

export type StartNodeData = { flow: StartFlow }
export type StartNode = Node<StartNodeData>
export type StartProps = NodeProps<StartNodeData>

export const StartNode = (props: StartProps) => {
  return <Branch {...props} isStart={true} />
}
