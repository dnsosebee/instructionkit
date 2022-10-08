import { proxy } from 'valtio'
import { DataDart } from '../core/floem'
import { DataFlow } from '../core/flow'

type Selectable = DataFlow | DataDart | null

type ChartState = { selected: Selectable }

const chartState = proxy<ChartState>({
  selected: null,
})
