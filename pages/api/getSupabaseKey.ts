// A hilariously unsecure compromise to get the Supabase key to the client since it's not possible to use environment variables in Next.js

import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY })
}
