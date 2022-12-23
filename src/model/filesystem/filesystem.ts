import { RepVersion, versionSchema } from '../replicache/spaces/proj/entries/version'

export const handleDownloadVersion = async (version: RepVersion, title: string): Promise<void> => {
  try {
    const newHandle = await window.showSaveFilePicker({
      suggestedName: `${title}.floem`,
    })
    const writableStream = await newHandle.createWritable()
    await writableStream.write(JSON.stringify(version))
    await writableStream.close()
  } catch (e) {
    console.error(e)
  }
}

export const handleUploadFloem = async (file: File): Promise<RepVersion> => {
  const json = await file.text()
  const version = JSON.parse(json)
  return versionSchema.parse(version)
}
