import { Dart } from '../../schema/types/dart/dart'
import { Flow } from '../../schema/types/flow/flow'
import { FlowUpdate } from '../replicache/spaces/proj/entries/flow'

type FlowChangeEvent =
  | { action: 'createFlow'; flow: Flow }
  | { action: 'updateFlow'; update: FlowUpdate }
  | { action: 'deleteFlow'; id: string }

export type DartChangeEvent =
  | { action: 'createDart'; dart: Dart }
  | { action: 'deleteDart'; id: string }

export type TitleChangeEvent = { action: 'updateTitle'; title: string }

export type FloemChangeEvent = FlowChangeEvent | DartChangeEvent | TitleChangeEvent

export type SendFloemChange = (changes: FloemChangeEvent | FloemChangeEvent[]) => void
