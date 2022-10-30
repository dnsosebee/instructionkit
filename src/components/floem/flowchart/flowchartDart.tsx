import { Edge, EdgeProps, getSmoothStepPath } from 'reactflow'

export type FlowchartEdge = Edge & { sourceHandle: string }
export type FlowchartDartProps = EdgeProps

export default function FlowchartDart({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd = 'arrow',
  interactionWidth = 5,
}: FlowchartDartProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 20,
  })

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 6 }}
        className='react-flow__edge-path'
        d={path}
        markerEnd={markerEnd}
      />
      {interactionWidth && (
        <path d={path} fill='none' strokeOpacity={0} strokeWidth={interactionWidth} />
      )}
    </>
  )
}
