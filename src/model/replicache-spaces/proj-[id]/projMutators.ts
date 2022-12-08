import { customAlphabet } from 'nanoid'
import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { logger as parentLogger } from '../../../logger'
import { WORKSPACE_ID_PREFIX } from '../app/keys/ws'
import { projectSchema, RepProject } from '../ws-[id]/keys/proj'
import { deploymentSchema, RepDeployment } from './keys/deployment'
import { DartUpdate, DataDart } from './keys/floem/dart'
import { DataFloem, floemSchema, FloemUpdate } from './keys/floem/floem'
import { DataFlow, DEFAULT_FLOWTEXT, FlowUpdate } from './keys/floem/flow'
import { ALPHABET, DART_UUID_LENGTH, FLOW_UUID_LENGTH, nextId } from './projIds'

const logger = parentLogger.child({ module: 'mutators' })

export const SPACE_WORKSPACE_ID_PREFIX = WORKSPACE_ID_PREFIX
export const WORKSPACE_UUID_LENGTH = 10
export const genWorkspaceUuid = customAlphabet(ALPHABET, WORKSPACE_UUID_LENGTH)
export const genWorkspaceId = () => SPACE_WORKSPACE_ID_PREFIX + genWorkspaceUuid()

export type WorkspaceMutators = typeof workspaceMutators
export type WorkspaceRep = Replicache<WorkspaceMutators>
export type WorkspaceMutate = WorkspaceRep['mutate'] & {
  spaceRelativeUrl: (path: string) => string
}

const parseOrSkip = <T>(schema: any, data: any, parse = true): T => {
  logger.info(parse ? 'parsing data: ' : 'skipped parsing data: ', data)
  return parse ? schema.parse(data) : data
}

export const workspaceMutators = {
  // Floem
  async createFloem(tx: WriteTransaction, floem: DataFloem) {
    await tx.put(floem.id, parseOrSkip(floemSchema, floem))
  },

  async updateFloem(tx: WriteTransaction, floem: FloemUpdate) {
    const prev: DataFloem = (await tx.get(floem.id)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floem.id}`)
    }
    const next = { ...prev, ...floem }
    await tx.put(floem.id, parseOrSkip(floemSchema, next))
  },

  async deleteFloem(tx: WriteTransaction, id: string) {
    await tx.del(id)
  },

  // Flow
  async addFlow(
    tx: WriteTransaction,
    data: { flow: Omit<DataFlow, 'createdAt'>; floemId: string },
  ) {
    const { flow, floemId } = data
    const prev: DataFloem = (await tx.get(floemId)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floemId}`)
    }
    // make sure the ID is new
    let id = flow.id
    while (prev.flows.some(flow => flow.id === id)) {
      id = nextId(id, FLOW_UUID_LENGTH)
    }
    const newFlow: DataFlow = {
      id,
      createdAt: Date.now(),
      position: flow.position ?? { x: 0, y: 0 },
      flowtext: flow.flowtext ?? DEFAULT_FLOWTEXT,
    }
    const flows = [...prev.flows, newFlow]
    await tx.put(floemId, parseOrSkip(floemSchema, { ...prev, flows }))
  },

  async updateFlow(tx: WriteTransaction, flowUpdate: FlowUpdate) {
    const prev: DataFloem = (await tx.get(flowUpdate.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${flowUpdate.floem}`)
    }
    const flows = prev.flows.map(f => (f.id === flowUpdate.id ? { ...f, ...flowUpdate } : f))
    await tx.put(prev.id, parseOrSkip(floemSchema, { ...prev, flows }))
  },

  // Dart
  async addDart(tx: WriteTransaction, data: { dart: DataDart; floem: string }) {
    const { dart, floem } = data
    const prev: DataFloem = (await tx.get(floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${floem}`)
    }
    let id = dart.id
    while (prev.darts.some(d => d.id === id)) {
      id = nextId(id, DART_UUID_LENGTH)
    }
    const darts = [
      ...prev.darts.filter(v => v.from != dart.from || v.case != dart.case),
      { ...dart, id },
    ]
    await tx.put(floem, parseOrSkip(floemSchema, { ...prev, darts }))
  },
  async updateDart(tx: WriteTransaction, dartUpdate: DartUpdate) {
    const prev: DataFloem = (await tx.get(dartUpdate.floem)) as DataFloem
    if (!prev) {
      throw new Error(`No floem with id ${dartUpdate.floem}`)
    }
    const darts = prev.darts.map(d => (d.id === dartUpdate.id ? { ...d, ...dartUpdate } : d))
    await tx.put(dartUpdate.floem, parseOrSkip(floemSchema, { ...prev, darts }))
  },

  // project
  async createProject(tx: WriteTransaction, project: RepProject) {
    await tx.put(project.id, parseOrSkip(projectSchema, project))
  },

  async createVersion(tx: WriteTransaction, data: { projectId: string; newVersionId: string }) {
    const { projectId, newVersionId } = data
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const { draftId } = project
    const draft = (await tx.get(draftId)) as DataFloem
    const newVersion = { ...draft, id: newVersionId }
    const updatedVersionIds = [...project.versionIds, newVersionId]
    const updatedProject = { ...project, versionIds: updatedVersionIds }
    await Promise.all([
      tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
      tx.put(newVersionId, parseOrSkip(floemSchema, newVersion)),
    ])
  },

  async resetDraftToVersion(tx: WriteTransaction, data: { projectId: string; versionId: string }) {
    const { projectId, versionId } = data
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const { draftId } = project
    const version = (await tx.get(versionId)) as DataFloem
    if (!version) {
      throw new Error(`No version with id ${versionId}`)
    }
    await tx.put(draftId, parseOrSkip(floemSchema, version))
  },

  async createAndDeploydeploymentFromDraft(
    tx: WriteTransaction,
    data: { projectId: string; newDeploymentId: string; newVersionId: string },
  ) {
    const { projectId, newDeploymentId, newVersionId } = data
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const existingVersion = (await tx.get(newVersionId)) as DataFloem
    if (existingVersion) {
      throw new Error(`Version with id ${newVersionId} already exists`)
    }
    const existingDeployment = (await tx.get(newDeploymentId)) as RepDeployment
    if (existingDeployment) {
      throw new Error(`Live version with id ${newDeploymentId} already exists`)
    }
    const { draftId } = project
    const draft = (await tx.get(draftId)) as DataFloem
    const newVersion = { ...draft, id: newVersionId }
    const updatedVersionIds = [...project.versionIds, newVersionId]
    const updatedProject = {
      ...project,
      versionIds: updatedVersionIds,
      deploymentId: newDeploymentId,
    }
    const newDeployment: RepDeployment = {
      id: newDeploymentId,
      createdAt: Date.now(),
      cachedFloem: newVersion,
      live: true,
    }
    await Promise.all([
      tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
      tx.put(newVersionId, parseOrSkip(floemSchema, newVersion)),
      tx.put(newDeploymentId, parseOrSkip(deploymentSchema, newDeployment)),
    ])
  },

  async createAndDeploydeploymentFromVersion(
    tx: WriteTransaction,
    data: { projectId: string; newDeploymentId: string; versionId: string },
  ) {
    const { projectId, newDeploymentId, versionId } = data
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const existingDeployment = (await tx.get(newDeploymentId)) as RepDeployment
    if (existingDeployment) {
      throw new Error(`Live version with id ${newDeploymentId} already exists`)
    }
    const version = (await tx.get(versionId)) as DataFloem
    if (!version) {
      throw new Error(`No version with id ${versionId}`)
    }
    if (!project.versionIds.includes(versionId)) {
      throw new Error(`Version ${versionId} is not part of project ${projectId}`)
    }
    const updatedProject = {
      ...project,
      deploymentId: newDeploymentId,
    }
    const newDeployment: RepDeployment = {
      id: newDeploymentId,
      createdAt: Date.now(),
      cachedFloem: version,
      live: true,
    }
    await Promise.all([
      tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
      tx.put(newDeploymentId, parseOrSkip(deploymentSchema, newDeployment)),
    ])
  },

  async updatedeploymentFromDraft(
    tx: WriteTransaction,
    data: { projectId: string; newVersionId: string },
  ) {
    const { projectId, newVersionId } = data
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const { deploymentId } = project
    if (!deploymentId) {
      throw new Error(`No live version for project ${projectId}`)
    }
    const deployment = (await tx.get(deploymentId)) as RepDeployment

    const existingVersion = (await tx.get(newVersionId)) as DataFloem
    if (existingVersion) {
      throw new Error(`Version with id ${newVersionId} already exists`)
    }
    const { draftId } = project
    const draft = (await tx.get(draftId)) as DataFloem
    const newVersion = { ...draft, id: newVersionId }
    const updatedVersionIds = [...project.versionIds, newVersionId]
    const updatedProject = {
      ...project,
      versionIds: updatedVersionIds,
    }
    const updatedDeployment = {
      ...deployment,
      cachedFloem: newVersion,
      deployed: true,
    }
    await Promise.all([
      tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
      tx.put(newVersionId, parseOrSkip(floemSchema, newVersion)),
      tx.put(deploymentId, parseOrSkip(deploymentSchema, updatedDeployment)),
    ])
  },

  async updatedeploymentFromVersion(
    tx: WriteTransaction,
    data: { projectId: string; versionId: string },
  ) {
    const { projectId, versionId } = data
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const { deploymentId, versionIds } = project
    if (!deploymentId) {
      throw new Error(`No live version for project ${projectId}`)
    }
    if (!versionIds.includes(versionId)) {
      throw new Error(`Version ${versionId} is not part of project ${projectId}`)
    }
    const deployment = (await tx.get(deploymentId)) as RepDeployment
    const version = (await tx.get(versionId)) as DataFloem
    if (!version) {
      throw new Error(`No version with id ${versionId}`)
    }
    const updatedDeployment = {
      ...deployment,
      cachedFloem: version,
      deployed: true,
    }
    await tx.put(deploymentId, parseOrSkip(deploymentSchema, updatedDeployment))
  },

  async undeploydeployment(tx: WriteTransaction, projectId: string) {
    const project = (await tx.get(projectId)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${projectId}`)
    }
    const { deploymentId } = project
    if (!deploymentId) {
      throw new Error(`No live version for project ${projectId}`)
    }
    const deployment = (await tx.get(deploymentId)) as RepDeployment
    const updatedDeployment = {
      ...deployment,
      deployed: false,
    }
    await tx.put(deploymentId, parseOrSkip(deploymentSchema, updatedDeployment))
  },

  async deleteProject(tx: WriteTransaction, id: string) {
    const project = (await tx.get(id)) as RepProject
    if (!project) {
      throw new Error(`No project with id ${id}`)
    }
    const { draftId, deploymentId, versionIds } = project
    await Promise.all([
      tx.del(id),
      tx.del(draftId),
      deploymentId && tx.del(deploymentId),
      ...versionIds.map(versionId => tx.del(versionId)),
    ])
  },
}

export const useWorkspaceRep = (id: string) => {
  return useReplicache<WorkspaceMutators>({ name: id, mutators: workspaceMutators })
}
