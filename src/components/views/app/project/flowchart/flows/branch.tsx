import { Node, NodeProps } from 'reactflow'
import { BranchFlow } from '../../../../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { FlowtextEditor } from '../flowtext/flowtextEditor'
import { FlowShell } from './flowShell'

export type BranchNodeData = {
  branch: BranchFlow
}
export type BranchNode = Node<BranchNodeData>
export type BranchProps = NodeProps<BranchNodeData>

export const BranchNode = ({ data: { branch }, selected }: BranchProps) => {
  return (
    <FlowShell {...{ id: branch.id, selected, acceptsIncoming: true }}>
      <FlowtextEditor branch={branch} />
    </FlowShell>
  )
}
