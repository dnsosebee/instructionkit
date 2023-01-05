import { Dart } from '../schema/types/dart/dart'
import { Floem, floemSchema } from '../schema/types/floem'
import { BranchFlow } from '../schema/types/flow/types/branch'
import { StartFlow } from '../schema/types/flow/types/start'

export const handleDownloadFloem = async (floem: Floem): Promise<void> => {
  try {
    const newHandle = await window.showSaveFilePicker({
      suggestedName: `${floem.title}.floem`,
    })
    const writableStream = await newHandle.createWritable()
    await writableStream.write(JSON.stringify(floem))
    await writableStream.close()
  } catch (e) {
    console.error(e)
  }
}

export const handleUploadFloem = async (file: File): Promise<Floem> => {
  const json = await file.text()
  const floem = JSON.parse(json)
  if (floem.schemaVersion) {
    return floemSchema.parse(floem)
  }
  return floemSchema.parse(v0migration(floem))
}

// should be out of date after wed Jan 4 2023 when I'm migrating to v1
// also this fails to copy flowstart flowtext
const v0migration = (floem: any): Floem => {
  const newFloem: Floem = {
    title: floem.title,
    schemaVersion: 1,
    flows: floem.flows.map((flow: any) => {
      if (flow.id === 'flow-start') {
        const startFlow: StartFlow = {
          type: 'start',
          id: 'start',
          position: flow.position,
        }
        return startFlow
      }
      const branchFlow: BranchFlow = {
        type: 'branch',
        id: flow.id.replace('flow-', ''),
        position: flow.position,
        flowtext: flow.flowtext.replaceAll('case-', 'c-'),
      }
      return branchFlow
    }),
    darts: floem.darts.map((dart: any) => {
      const newDart: Dart = {
        id: dart.id.replace('dart-', ''),
        type: 'goto',
        from: dart.from.replace('flow-', ''),
        case: dart.case === 'case-dfalt' ? 'default' : dart.case.replace('case-', 'c-'),
        to: dart.to.replace('flow-', ''),
      }
      return newDart
    }),
    createdAt: floem.createdAt,
  }
  return newFloem
}
