import { proxy } from 'valtio'
import { DataDart } from '../core/floem'
import { DataFlow } from '../core/flow'

type Selectable = DataFlow | DataDart | null

type FlowpadState = { selected: Selectable }

const flowpadState = proxy<FlowpadState>({
  selected: null,
})
