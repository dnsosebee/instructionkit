import { DataFloem, floemSchema } from '../replicache-spaces/proj-[id]/keys/floem/floem'

export const handleDownloadFloem = async (floem: DataFloem): Promise<void> => {
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

export const handleUploadFloem = async (file: File): Promise<DataFloem> => {
  const json = await file.text()
  const floem = JSON.parse(json)
  return floemSchema.parse(floem) as DataFloem
}
