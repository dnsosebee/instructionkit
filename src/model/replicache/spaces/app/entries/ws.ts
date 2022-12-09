import { ReadTransaction } from 'replicache'
import z from 'zod'
import { genUuid, key } from '../../../ids'

const WORKSPACE_KEY_PREFIX = 'ws'
export const WORKSPACE_UUID_LENGTH = 10
export const workspaceSchema = z.object({
  id: z.string().length(WORKSPACE_UUID_LENGTH),
  name: z.string().min(1).max(100),
  icon: z.string().min(1).max(100), // TODO: tighten this up
  createdAt: z.number().int().positive(),
})
export const genWorkspaceId = genUuid(WORKSPACE_UUID_LENGTH)
export const workspaceKey = key(WORKSPACE_KEY_PREFIX)

export type RepWorkspace = z.infer<typeof workspaceSchema>
export type WorkspaceUpdate = Pick<RepWorkspace, 'id'> & Partial<Omit<RepWorkspace, 'createdAt'>>

export const listWorkspaces = async (tx: ReadTransaction): Promise<RepWorkspace[]> => {
  return (await tx.scan({ prefix: WORKSPACE_KEY_PREFIX }).values().toArray()) as RepWorkspace[]
}
