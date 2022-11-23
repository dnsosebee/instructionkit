import Airtable from 'airtable'
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateEmail } from '../../src/lib/validation'
import { logger } from '../../src/logger'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return new Promise<void>(resolve => {
    const { email } = req.body

    // ensure email is valid
    if (!email || !validateEmail(email)) {
      res.status(400).json({ error: 'Invalid request' })
      return resolve()
    }

    // make sure env vars are defined for airtable
    if (
      !process.env.AIRTABLE_API_KEY ||
      !process.env.AIRTABLE_BASE_ID ||
      !process.env.AIRTABLE_TABLE_NAME
    ) {
      res.status(500).json({ error: 'Airtable not configured' })
      return resolve()
    }

    // check if we already have a record for this email
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
      process.env.AIRTABLE_BASE_ID,
    )

    base(process.env.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `email = '${email}'`,

        // only return the first record
        maxRecords: 1,
      })
      .firstPage((err: any, records: any) => {
        if (err) {
          logger.error(err)
          res.status(500).json({ error: 'Failed to check waitlist entry' })
          return resolve()
        }

        if (records.length === 0) {
          // no record found, so add them to the waitlist
          base(process.env.AIRTABLE_TABLE_NAME!).create(
            [
              {
                fields: {
                  email: email,
                },
              },
            ],
            (err: any, records: any) => {
              if (err) {
                logger.error(err)
                res.status(500).json({ error: 'Failed to add to waitlist' })
                return resolve()
              }

              res.status(200).json({ success: true, alreadyProvidedInfo: false })
              return resolve()
            },
          )
        }
        // so we have a record
        else {
          // have they provided additional information: company_website, company_size, title, how_did_you_hear, name ?
          if (
            records &&
            records[0] &&
            records[0].fields &&
            records[0].fields.company_website &&
            records[0].fields.company_size &&
            records[0].fields.title &&
            records[0].fields.how_did_you_hear &&
            records[0].fields.name
          ) {
            res.status(200).json({ success: true, alreadyProvidedInfo: true })
            return resolve()
          } else {
            res.status(200).json({ success: true, alreadyProvidedInfo: false })
            return resolve()
          }
        }
      })
  })
}
