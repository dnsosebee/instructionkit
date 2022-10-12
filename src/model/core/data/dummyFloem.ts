import { nanoid } from 'nanoid'
import { DataFloem } from '../floem'
import { STARTER_CONTENT } from './content'

export const genFloemId = () => `floem-${nanoid()}`

export const starterFloem = (id: string = genFloemId()): DataFloem => {
  return {
    id,
    title: 'My New Floem',
    createdAt: Date.now(),
    flows: [
      {
        id: 'flow-start',
        floem: id,
        flowtext: STARTER_CONTENT,
        createdAt: Date.now(),
        position: { x: 20, y: 50 },
      },
      {
        id: 'flow-l0Lo1',
        floem: id,
        flowtext: STARTER_CONTENT,
        createdAt: Date.now(),
        position: { x: 200, y: 600 },
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
