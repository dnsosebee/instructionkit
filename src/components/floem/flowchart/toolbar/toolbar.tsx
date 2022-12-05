import { DocumentMinusIcon, DocumentPlusIcon, PlayIcon } from '@heroicons/react/20/solid'
import { DataFloem } from '../../../../model/replicache-spaces/ws-[id]/floem'
import { DEFAULT_FLOWTEXT } from '../../../../model/replicache-spaces/ws-[id]/flow'
import { FLOW_START_ID, genFlowId } from '../../../../model/replicache-spaces/ws-[id]/ids'
import { WorkspaceMutate } from '../../../../model/replicache-spaces/ws-[id]/workspaceMutators'
import { IconButton } from './iconButton'

export interface ToolbarProps {
  mutate: WorkspaceMutate
  floem: DataFloem
  nodeSelections: boolean[]
  edgeSelections: boolean[]
}

export const Toolbar = ({ mutate, floem, nodeSelections, edgeSelections }: ToolbarProps) => {
  const disableDelete =
    (nodeSelections.every(v => !v) && edgeSelections.every(v => !v)) ||
    nodeSelections[floem.flows.findIndex(flow => flow.id === FLOW_START_ID)]

  return (
    <div className='static'>
      <span className='isolate shadow bg-white rounded-bl-lg inline-flex overflow-hidden'>
        <IconButton
          Icon={DocumentPlusIcon}
          onClick={() =>
            mutate.addFlow({
              flow: { id: genFlowId(), position: { x: 0, y: 0 }, flowtext: DEFAULT_FLOWTEXT },
              floemId: floem.id,
            })
          }
          title='Add Flow'
        />
        <IconButton
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
        />
        {/* save button */}
        <IconButton
          Icon={PlayIcon}
          onClick={() =>
            mutate.updateFloem({
              id: floem.id,
              flows: floem.flows.filter((_, i) => !nodeSelections[i]),
              darts: floem.darts.filter((_, i) => !edgeSelections[i]),
            })
          }
          title='Delete'
          disabled={disableDelete}
        />
        <a href={mutate.spaceRelativeUrl(`/river/${floem.id}`)} target='_blank'>
          <IconButton Icon={PlayIcon} onClick={() => null} title='Embark' />
        </a>
      </span>
    </div>
  )
}
