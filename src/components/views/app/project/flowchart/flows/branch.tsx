import { Handle, Node, NodeProps, Position } from 'reactflow'
import { GOTO_DART_TYPE } from '../../../../../../model/replicache/spaces/proj/entries/dart/types/goto'
import { RepBranch } from '../../../../../../model/replicache/spaces/proj/entries/flow/types/branch'
import { DEFAULT_HANDLE_ID } from '../../../../../../model/tiptap/flowtextExtension'
import { useProjectCtx } from '../../../../../loaders/providers/projectProvider'
import { FlowtextEditor } from '../flowtext/flowtextEditor'
import { StartProps } from './start'

export type BranchData = {
  flow: RepBranch
}
export type BranchNode = Node<BranchData>
export type BranchProps = NodeProps<BranchData>

export const BranchNode = (props: BranchProps) => {
  return <Branch {...props} isStart={false} />
}

export const Branch = ({
  data: { flow },
  selected,
  isStart,
}: (BranchProps | StartProps) & { isStart: boolean }) => {
  const { darts } = useProjectCtx()
  const isTop =
    darts.filter(dart => dart.to === flow.id && dart.type === GOTO_DART_TYPE).length === 0
  const isBottom =
    darts.filter(dart => dart.from === flow.id && dart.type === GOTO_DART_TYPE).length === 0
  return (
    <div className='w-[42rem]'>
      <div
        className={`px-4 ${isTop ? 'pt-4' : ''} ${
          isBottom ? 'pb-4' : ''
        } bg-slate-900 shadow rounded-lg cursor-move ${
          selected && 'border-indigo-500 outline-none ring-1 ring-indigo-500'
        }`}
      >
        <div className={`list-disc flex-grow cursor-default nodrag bg-zinc-50`}>
          {isStart || (
            <div className='flex flex-col bg-transparent bg-inherit relative justify-center text-sky-500 hover:bg-sky-500 hover:text-zinc-50 duration-150'>
              {isTop || (
                <div className='fringe-top z-10 width-full bg-inherit'>
                  <div className='bg-inherit' />
                </div>
              )}
              <div className='my-1 text-xs font-bold self-center select-none relative z-50 pointer-events-none'>
                +
              </div>
              <Handle
                type='target'
                position={Position.Top}
                className='z-20 opacity-0'
                style={{ top: 0, width: '100%', height: '100%' }}
              />
            </div>
          )}
          <FlowtextEditor flow={flow} />
          <div className='flex flex-col bg-transparent bg-inherit relative justify-center text-sky-500 hover:bg-sky-500 hover:text-zinc-50 duration-150'>
            <div className='my-1 text-xs font-bold self-center select-none relative z-50 pointer-events-none'>
              +
            </div>
            <Handle
              id={DEFAULT_HANDLE_ID}
              type='source'
              position={Position.Bottom}
              className='z-20 opacity-0'
              style={{ top: 0, width: '100%', height: '100%' }}
            />
            {isBottom || (
              <div className='fringe-bottom z-10 width-full bg-inherit'>
                <div className='bg-inherit' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
