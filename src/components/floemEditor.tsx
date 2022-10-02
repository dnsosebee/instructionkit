import { Floem, Flow, Dart, FloemUpdate } from '../floem'
import { keyBy } from 'lodash'
import React from 'react'

interface FlowEditorProps {
  flow: Flow
}

interface DartEditorProps {
  dart: Dart
  fromX: number
  fromY: number
  toX: number
  toY: number
}

export const FlowEditor = ({flow}: FlowEditorProps) => {
  return (
    <foreignObject x={flow.x} y={flow.y} width={100} height={100}>
      <div className='border shadow rounded'>
        {flow.text}
      </div>
    </foreignObject>
  )
}

export const DartEditor = ({dart, fromX, fromY, toX, toY}: DartEditorProps) => {
  return (
    <g>
      <line x1={fromX} y1={fromY} x2={toX} y2={toY} strokeWidth={1} stroke='#000'/>
    </g>
  )
}

interface FlowpadProps {
  floem: Floem;
}

export const Flowpad = ({ floem }: FlowpadProps) => {

  const handleClick = () => {
    alert('hello')
  }

  const flowMap = keyBy(floem.flows, v => v.id)

  const dartEditorProps: DartEditorProps[] = floem.darts.map(dart => {
    const { x: fromX, y: fromY} = flowMap[dart.from]
    const { x: toX, y: toY} = flowMap[dart.to]
    return {dart, fromX, fromY, toX, toY}
  })

  return (
    <div>
      <div id='toolbar'>
      </div>
      <svg>
        <g id='scenegraph' onClick={handleClick}>
          <g id='darts'>
            {dartEditorProps.map(props => (
              <DartEditor {...props} />
            ))}
          </g>
          <g id='flows'>
            {floem.flows.map(flow => (
              <FlowEditor flow={flow}/>
            ))}
          </g>
        </g>
      </svg>
    </div>
  ) 
}

