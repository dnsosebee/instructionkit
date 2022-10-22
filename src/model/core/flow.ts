type Position = {
  x: number
  y: number
}

export type DataFlow = {
  id: string
  floem: string
  flowtext: string
  createdAt: number
  position: Position
}

export type FlowUpdate = Partial<DataFlow> & Pick<DataFlow, 'id'> & Pick<DataFlow, 'floem'>
