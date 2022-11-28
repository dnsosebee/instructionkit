// This file defines our Doc domain type in TypeScript, and a related helper
// function to get all Docs. You'd typically have one of these files for each
// domain object in your application.

import { ReadTransaction } from 'replicache'
import { z } from 'zod'

export const WORKSPACES_SPACE_ID = 'workspaces'
export const MEMBERSHIP_ID_PREFIX = 'membership/'
export const WORKSPACE_ID_PREFIX = 'workspace/'

export const membershipSchema = z.object({
  workspaceId: z.string(),
  userId: z.string(),
  accessPolicy: z.string(),
})

export type RepMembership = z.infer<typeof membershipSchema>

export const workspaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  createdAt: z.number(),
})

export type RepWorkspace = z.infer<typeof workspaceSchema>

// get all memberships for the user with userId
export const listUserMemberships =
  (userId: string) =>
  async (tx: ReadTransaction): Promise<RepMembership[]> => {
    return (await tx.scan().entries().toArray())
      .filter(([key, _]) => key.startsWith(MEMBERSHIP_ID_PREFIX) && key.endsWith(`/${userId}`))
      .map(([id, accessPolicy]) => ({
        workspaceId: id.split('/')[1],
        userId: id.split('/')[2],
        accessPolicy: accessPolicy as string,
      }))
  }

export const listWorkspaceMemberships =
  (workspaceId: string) =>
  async (tx: ReadTransaction): Promise<RepMembership[]> => {
    return (await tx.scan().entries().toArray())
      .filter(([key, _]) => key.startsWith(`${MEMBERSHIP_ID_PREFIX}${workspaceId}`))
      .map(([id, accessPolicy]) => ({
        workspaceId: id.split('/')[1],
        userId: id.split('/')[2],
        accessPolicy: accessPolicy as string,
      }))
  }

export const listWorkspaces = async (tx: ReadTransaction): Promise<RepWorkspace[]> => {
  return (
    (await tx.scan().entries().toArray()).filter(([key, _]) =>
      key.startsWith(WORKSPACE_ID_PREFIX),
    ) as [string, RepWorkspace][]
  ).map(([_, v]) => v)
}
