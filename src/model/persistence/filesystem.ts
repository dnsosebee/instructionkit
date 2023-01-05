import { Floem, floemSchema } from '../schema/types/floem'

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
  return floemSchema.parse(floem)
}
