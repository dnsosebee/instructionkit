import Airtable from 'airtable'
import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { email, company_website, company_size, title, how_did_you_hear, name } = req.body

  // make sure they're all defined and the email is valid
  if (!company_website || !company_size || !title || !how_did_you_hear) {
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

  // find and update the record for this email
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

      if (records.length === 0) {
        res.status(200).json({ success: false, error: 'Not on waitlist' })
        return
      }

      base(process.env.AIRTABLE_TABLE_NAME!).update(
        [
          {
            id: records[0].id,
            fields: {
              company_website: company_website,
              company_size: company_size,
              title: title,
              how_did_you_hear: how_did_you_hear,
              name: name,
            },
          },
        ],
        (err: any, records: any) => {
          if (err) {
            console.error(err)
            res.status(500).json({ error: 'Failed to update waitlist entry' })
            return
          }

          res.status(200).json({ success: true })
        },
      )
    })
}
