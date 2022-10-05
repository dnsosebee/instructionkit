import { proxy } from 'valtio'
import { Dart } from '../core/floem'
import { Flow } from '../core/flow'

type Selectable = Flow | Dart | null

type FlowpadState = { selected: Selectable }

const flowpadState = proxy<FlowpadState>({
  selected: null,
})
