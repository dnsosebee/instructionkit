import { DocumentPlusIcon } from '@heroicons/react/20/solid'
import { genFlowId } from '../../../../../model/replicache/spaces/proj/entries/flow/flow'
import {
  BranchFlow,
  BRANCH_FLOW_TYPE,
  EMPTY_BRANCH_FLOWTEXT,
} from '../../../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { IconButton } from './iconButton'
export interface ToolbarProps {
  addBranch: (branch: BranchFlow) => void
}

export const Toolbar = ({ addBranch }: ToolbarProps) => {
  // const disableDelete =
  //   (nodeSelections.every(v => !v) && edgeSelections.every(v => !v)) ||
  //   nodeSelections[floem.flows.findIndex(flow => flow.id === FLOW_START_ID)]

  return (
    <div className='static'>
      <span className='isolate shadow bg-white rounded-bl-lg inline-flex overflow-hidden'>
        <IconButton
          Icon={DocumentPlusIcon}
          onClick={() =>
            addBranch({
              id: genFlowId(),
              type: BRANCH_FLOW_TYPE,
              position: { x: 0, y: 0 },
              flowtext: EMPTY_BRANCH_FLOWTEXT,
            })
          }
          title='Add Flow'
        />
        {/* <IconButton
          Icon={DocumentMinusIcon}
          onClick={() =>
            mutate.updateFloem({
              id: floem.id,
              flows: floem.flows.filter((_, i) => !nodeSelections[i]),
              darts: floem.darts.filter((_, i) => !edgeSelections[i]),
            })
          }
          title='Delete'
          disabled={disableDelete}
        /> */}
        {/* save button */}
        {/* <IconButton
          Icon={DocumentArrowDownIcon}
          onClick={() => handleDownloadFloem(floem)}
          title='Download'
        />
        <a href={mutate.spaceRelativeUrl(`/river/${floem.id}`)} target='_blank'>
          <IconButton Icon={PlayIcon} onClick={() => null} title='Embark' />
        </a> */}
      </span>
    </div>
  )
}
