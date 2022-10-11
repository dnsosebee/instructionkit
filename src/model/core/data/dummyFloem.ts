import { nanoid } from 'nanoid'
import { DataFloem } from '../floem'
import { STARTER_CONTENT } from './content'

export const genDummyFloemId = () => `floem-${nanoid()}`

export const genDummyFloem = (id: string = genDummyFloemId()): DataFloem => {
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
        position: { x: 0, y: 0 },
      },
      {
        id: 'flow-l0Lo1',
        floem: id,
        flowtext: STARTER_CONTENT,
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
