import { Edge, EdgeProps, getSmoothStepPath } from 'reactflow'

export type GotoEdge = Edge & { sourceHandle: string }
export type GotoProps = EdgeProps

export const GotoEdge = ({
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
}: GotoProps) => {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY: sourceY - 8,
    sourcePosition,
    targetX,
    targetY: targetY + 10,
    targetPosition,
    borderRadius: 20,
  })

  return (
    <>
      <path
        id={id}
        style={{ ...style, strokeWidth: 1.5, strokeLinecap: 'butt', stroke: '#0EA5E9' }}
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
