import Airtable from 'airtable'
import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.body

  // make sure email is defined
  if (!email || !email.includes('@') || !(typeof email === 'string')) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }

  // make sure env vars are defined for airtable
  if (
    !process.env.AIRTABLE_API_KEY ||
    !process.env.AIRTABLE_BASE_ID ||
    !process.env.AIRTABLE_TABLE_NAME
  ) {
    res.status(500).json({ error: 'Airtable not configured' })
    return
  }

  // check if airtable already has a record for this email
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID,
  )
  base(process.env.AIRTABLE_TABLE_NAME)
    .select({
      filterByFormula: `email = '${email}'`,
    })
    .firstPage((err: any, records: any) => {
      if (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to check waitlist entry' })
        return
      }

      if (records.length > 0) {
        res.status(200).json({ success: false, error: 'Already on waitlist' })
        return
      }
    })

  // create a record for this waitlist entry
  base(process.env.AIRTABLE_TABLE_NAME).create(
    [
      {
        fields: {
          email: email,
        },
      },
    ],
    (err: any, records: any) => {
      if (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create waitlist entry' })
        return
      }

      res.status(200).json({ success: true })
    },
  )
}
