import { createClient } from '@supabase/supabase-js'
import { logger } from '../../logger'

const errorImageUrl =
  'https://media.australian.museum/media/dd/images/Some_image.width-800.bbe274e.jpg'

const computeHash = async (file: File): Promise<string> => {
  const data = await file.arrayBuffer()
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('')
}

export const uploadBlob = async (file: File): Promise<string> => {
  // This monstrosity will change once we have auth
  const supabaseKey = await fetch('/api/getSupabaseKey')
    .then(res => res.json())
    .then(res => res.key)

  const supabase = createClient('https://fvdevhpbooirqodnxcyc.supabase.co', supabaseKey)

  const hash = await computeHash(file)
  const extant = await supabase.storage.from('blobs').getPublicUrl(hash)
  const download = await supabase.storage.from('blobs').download(hash)

  console.log('Uploading Blob', { hash, extant })

  // Super weird and hacky, but for some reason getPublicUrl succeeds even if the file doesn't exist
  if (!download.error && extant.publicURL) {
    console.log('Downloaded file', { download })
    console.log('Found extant instance of this file. Returning:', extant.publicURL)
    return extant.publicURL
  }

  const uploadResponse = await supabase.storage.from('blobs').upload(hash, file)

  if (uploadResponse.error) {
    console.error('Error uploading file to Supabase:', uploadResponse.error)
    return errorImageUrl
  }

  // Feels weird, is there a better way to get the public URL after uploading?
  const publicUrlResponse = await supabase.storage.from('blobs').getPublicUrl(hash)

  if (publicUrlResponse.error) {
    console.error('Error retrieving public URL from Supabase:', uploadResponse.error)
    return errorImageUrl
  }

  console.log('Uploaded file to Supabase:', publicUrlResponse.publicURL)

  return publicUrlResponse.publicURL!
}
