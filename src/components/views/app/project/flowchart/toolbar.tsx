import { DocumentPlusIcon } from '@heroicons/react/20/solid'
import { PlayIcon } from '@heroicons/react/24/solid'
import { SendFloemChange } from '../../../../../model/persistence/shared/floemChangeEvent'
import { genFlowId } from '../../../../../model/schema/types/flow/baseFlow'
import {
  BRANCH_FLOW_TYPE,
  EMPTY_BRANCH_FLOWTEXT,
} from '../../../../../model/schema/types/flow/types/branch'
import { useFlowchartCtx } from '../../../../loaders/providers/flowchartProvider'
import { IconButton } from './iconButton'
export interface ToolbarProps {
  send: SendFloemChange
}

export const Toolbar = ({ send }: ToolbarProps) => {
  // const disableDelete =
  //   (nodeSelections.every(v => !v) && edgeSelections.every(v => !v)) ||
  //   nodeSelections[floem.flows.findIndex(flow => flow.id === FLOW_START_ID)]
  const { previewHref } = useFlowchartCtx()

  return (
    <div className='static'>
      <span className='isolate shadow bg-white rounded-bl-lg inline-flex overflow-hidden'>
        <IconButton
          Icon={DocumentPlusIcon}
          onClick={() =>
            send({
              action: 'createFlow',
              flow: {
                id: genFlowId(),
                type: BRANCH_FLOW_TYPE,
                position: { x: 0, y: 0 },
                flowtext: EMPTY_BRANCH_FLOWTEXT,
              },
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
        /> */}
        <a href={previewHref} target='_blank' rel='noopener noreferrer'>
          <IconButton Icon={PlayIcon} onClick={() => null} title='Preview' />
        </a>
      </span>
    </div>
  )
}
