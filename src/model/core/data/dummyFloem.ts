import { nanoid } from 'nanoid'
import { DataFloem } from '../floem'
import { starterContent } from './content'

export const genDummyFloem = (): DataFloem => {
  const id = nanoid()
  return {
    id,
    title: 'Floem',
    createdAt: Date.now(),
    flows: [
      {
        id: 'flow-start',
        floem: id,
        flowtext: starterContent,
        createdAt: Date.now(),
        position: { x: 0, y: 0 },
      },
      {
        id: 'flow-l0Lo1',
        floem: id,
        flowtext: '<p>Flow 2</p>',
        createdAt: Date.now(),
        position: { x: 100, y: 600 },
      },
    ],
    darts: [
      {
        id: 'dart1',
        floem: id,
        from: 'flow-start',
        to: 'flow-l0Lo1',
        case: 'hello',
      },
    ],
  }
}
