import { Node, NodeProps } from 'reactflow'
import { RepStart } from '../../../../../../model/replicache/spaces/proj/entries/flow/types/start'
import { Branch } from './branch'

type StartData = { flow: RepStart }
export type StartNode = Node<StartData>
export type StartProps = NodeProps<StartData>

export const StartNode = (props: StartProps) => {
  return <Branch {...props} isStart={true} />
}
