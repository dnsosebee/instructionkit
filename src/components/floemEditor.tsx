import { Floem, Flow, Dart, FloemUpdate } from '../floem'
import React from 'react'

interface FlowEditorProps {
  flow: Flow
}

export const FlowEditor = ({flow}: FlowEditorProps) => {
  return (
    <foreignObject x={flow.x} y={flow.y} width={100} height={100}>
      <div className='border'>
        {flow.text}
      </div>
    </foreignObject>
  )
}


interface FlowpadProps {
  floem: Floem;
}

export const Flowpad = ({ floem }: FlowpadProps) => {

  const handleClick = () => {
    alert('hello')
  }

  return (
    <div>
      <div id='toolbar'>
      </div>
      <svg>
        <g id='scenegraph' onClick={handleClick}>
          <g id='darts'></g>
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

