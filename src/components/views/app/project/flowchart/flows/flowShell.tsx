import React from 'react'
import { Handle, Position } from 'reactflow'
import { GOTO_DART_TYPE } from '../../../../../../model/replicache/spaces/proj/entries/dart/types/goto'
import { DEFAULT_HANDLE_ID } from '../../../../../../model/tiptap/flowtextExtension'
import { useFlowchartCtx } from '../../../../../loaders/providers/flowchartProvider'

export const FlowShell = ({
  id,
  selected,
  acceptsIncoming,
  children,
}: {
  id: string
  selected: boolean
  acceptsIncoming: boolean
  children: React.ReactNode
}) => {
  const { darts } = useFlowchartCtx()
  const isTop = darts.filter(dart => dart.to === id && dart.type === GOTO_DART_TYPE).length === 0
  const isBottom =
    darts.filter(dart => dart.from === id && dart.type === GOTO_DART_TYPE).length === 0
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
          {acceptsIncoming && (
            <div className='flex flex-col bg-inherit relative justify-center text-sky-500 hover:bg-sky-500 hover:text-zinc-50 duration-150'>
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
          {children}
          <div className='flex flex-col bg-inherit relative justify-center text-sky-500 hover:bg-sky-500 hover:text-zinc-50 duration-150'>
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
