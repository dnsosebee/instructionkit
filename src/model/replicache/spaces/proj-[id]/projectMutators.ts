import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { logger as parentLogger } from '../../../../lib/logger'
import { nextId, scopedKey } from '../../IdsAndKeys'
import { PROJECT_KEY_PREFIX } from '../ws-[id]/entries/proj'
import { flowKey, FlowPositionUpdate, FlowRemove, flowSchema, RepFlow } from './entries/flow/flow'
import { branchKey, branchSchema, RepBranch } from './entries/flow/types/branch'
import { refKey, RepRef } from './entries/flow/types/ref'
import { RepStart, startKey, startSchema } from './entries/flow/types/start'
import { SubCreate, subKey } from './entries/flow/types/sub'

const logger = parentLogger.child({ module: 'projectMutators' })

export const PROJECT_SPACE_PREFIX = PROJECT_KEY_PREFIX
// for creating and accessing a project's replicache instance, we want to scope by workspaceId and projectId
// note that this is different from the projectKey within the workspaceRep, which is not scoped by workspaceId
export const projectSpaceKey = scopedKey(PROJECT_SPACE_PREFIX)

export type ProjectMutators = typeof projectMutators
export type ProjectRep = Replicache<ProjectMutators>

export const useProjectRep = (workspaceId: string, projectId: string) => {
  return useReplicache({
    name: projectSpaceKey(workspaceId, projectId),
    mutators: projectMutators,
  })
}

// const removeFlow = async (
//   tx: WriteTransaction,
//   remove: Pick<RepFlow, 'id' | 'type'>,
// ) => {
//   const key = flowKey(remove.type, remove.id)
//   if (remove.type === START_FLOW_TYPE) {
//     throw new Error(`Can't remove start flow ${remove.id}`)
//   }
//   if (remove.type === SUB_FLOW_TYPE) {
//     const flows = (await listFlows(tx))
//     recursiveRemoveFlow(tx, remove.id, flows)
//   }
//   await tx.del(key)
// }

// const recursiveRemoveFlow = async (tx: WriteTransaction, subFlowId: string, flows: RepFlow[]) => {
//   const children = flows.filter(f => f.parent === subFlowId)
//   for (const child of children) {
//     if (child.type === SUB_FLOW_TYPE) {
//     await recursiveRemoveFlow(tx, child.id, flows)
//     await tx.del(flowKey(child.type, child.id))
//   }
// }

// for the following apply functions, let's assume the flow exists. We can check that in the mutator
const updateFlowPosition = async (tx: WriteTransaction, update: FlowPositionUpdate) => {
  logger.info(`Updating flow position: ${update.id} to ${update.position}`)
  const key = flowKey(update.type, update.id)
  const flow = (await tx.get(key)) as RepFlow
  if (!flow) {
    throw new Error(`Flow ${update.id} does not exist`)
  }
  await tx.put(key, flowSchema.parse({ ...flow, position: update.position }))
}

const removeFlow = async (tx: WriteTransaction, remove: FlowRemove) => {
  logger.info(`Removing flow: ${remove.id}`)
  const key = flowKey(remove.type, remove.id)
  tx.del(key)
}

export const projectMutators = {
  // flow/start
  // init should be called when initializing a project
  async init(tx: WriteTransaction, start: RepStart) {
    logger.info(`Initializing project with start flow: ${start.id}`)
    if (!tx.isEmpty()) {
      throw new Error(`Project already initialized, can't create flowstart`)
    }
    await tx.put(startKey(start.id), startSchema.parse(start))
  },
  // flows
  async applyFlowChanges(
    tx: WriteTransaction,
    changes: { positionUpdates: FlowPositionUpdate[]; removes: FlowRemove[] },
  ) {
    logger.info(`Applying flow changes: ${JSON.stringify(changes)}`)
    for (const update of changes.positionUpdates) {
      await updateFlowPosition(tx, update)
    }
    for (const remove of changes.removes) {
      await removeFlow(tx, remove)
    }
  },

  // flow/branch
  async createBranch(tx: WriteTransaction, branch: RepBranch) {
    logger.info(`Creating branch: ${branch.id}`)
    let id = branch.id
    let key = branchKey(id)
    let prev = (await tx.get(key)) as RepBranch
    while (prev) {
      id = nextId(id)
      key = branchKey(id)
      prev = (await tx.get(key)) as RepBranch
    }
    branch = { ...branch, id }
    await tx.put(key, branchSchema.parse(branch))
  },

  async deleteBranch(tx: WriteTransaction, id: string) {
    logger.info(`Deleting branch: ${id}`)
    const key = branchKey(id)
    await tx.del(key)
  },

  // flow/sub
  async createSub(tx: WriteTransaction, { sub, start }: SubCreate) {
    logger.info(`Creating sub flow: ${sub.id}`)
    await Promise.all([
      tx.put(subKey(sub.id), flowSchema.parse(sub)),
      tx.put(startKey(start.id), startSchema.parse(start)),
    ])
  },

  //flow/ref
  async createRef(tx: WriteTransaction, ref: RepRef) {
    logger.info(`Creating ref: ${ref.id}`)
    await tx.put(refKey(ref.id), flowSchema.parse(ref))
  },
}

// some old mutators

// export const workspaceMutators = {
//   // Floem
//   async createFloem(tx: WriteTransaction, floem: DataFloem) {
//     await tx.put(floem.id, parseOrSkip(floemSchema, floem))
//   },

//   async updateFloem(tx: WriteTransaction, floem: FloemUpdate) {
//     const prev: DataFloem = (await tx.get(floem.id)) as DataFloem
//     if (!prev) {
//       throw new Error(`No floem with id ${floem.id}`)
//     }
//     const next = { ...prev, ...floem }
//     await tx.put(floem.id, parseOrSkip(floemSchema, next))
//   },

//   async deleteFloem(tx: WriteTransaction, id: string) {
//     await tx.del(id)
//   },

//   // Flow
//   async addFlow(
//     tx: WriteTransaction,
//     data: { flow: Omit<DataFlow, 'createdAt'>; floemId: string },
//   ) {
//     const { flow, floemId } = data
//     const prev: DataFloem = (await tx.get(floemId)) as DataFloem
//     if (!prev) {
//       throw new Error(`No floem with id ${floemId}`)
//     }
//     // make sure the ID is new
//     let id = flow.id
//     while (prev.flows.some(flow => flow.id === id)) {
//       id = nextId(id, FLOW_UUID_LENGTH)
//     }
//     const newFlow: DataFlow = {
//       id,
//       createdAt: Date.now(),
//       position: flow.position ?? { x: 0, y: 0 },
//       flowtext: flow.flowtext ?? DEFAULT_FLOWTEXT,
//     }
//     const flows = [...prev.flows, newFlow]
//     await tx.put(floemId, parseOrSkip(floemSchema, { ...prev, flows }))
//   },

//   async updateFlow(tx: WriteTransaction, flowUpdate: FlowUpdate) {
//     const prev: DataFloem = (await tx.get(flowUpdate.floem)) as DataFloem
//     if (!prev) {
//       throw new Error(`No floem with id ${flowUpdate.floem}`)
//     }
//     const flows = prev.flows.map(f => (f.id === flowUpdate.id ? { ...f, ...flowUpdate } : f))
//     await tx.put(prev.id, parseOrSkip(floemSchema, { ...prev, flows }))
//   },

//   // Dart
//   async addDart(tx: WriteTransaction, data: { dart: DataDart; floem: string }) {
//     const { dart, floem } = data
//     const prev: DataFloem = (await tx.get(floem)) as DataFloem
//     if (!prev) {
//       throw new Error(`No floem with id ${floem}`)
//     }
//     let id = dart.id
//     while (prev.darts.some(d => d.id === id)) {
//       id = nextId(id, DART_UUID_LENGTH)
//     }
//     const darts = [
//       ...prev.darts.filter(v => v.from != dart.from || v.case != dart.case),
//       { ...dart, id },
//     ]
//     await tx.put(floem, parseOrSkip(floemSchema, { ...prev, darts }))
//   },
//   async updateDart(tx: WriteTransaction, dartUpdate: DartUpdate) {
//     const prev: DataFloem = (await tx.get(dartUpdate.floem)) as DataFloem
//     if (!prev) {
//       throw new Error(`No floem with id ${dartUpdate.floem}`)
//     }
//     const darts = prev.darts.map(d => (d.id === dartUpdate.id ? { ...d, ...dartUpdate } : d))
//     await tx.put(dartUpdate.floem, parseOrSkip(floemSchema, { ...prev, darts }))
//   },

//   // project
//   async createProject(tx: WriteTransaction, project: RepProject) {
//     await tx.put(project.id, parseOrSkip(projectSchema, project))
//   },

//   async createVersion(tx: WriteTransaction, data: { projectId: string; newVersionId: string }) {
//     const { projectId, newVersionId } = data
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const { draftId } = project
//     const draft = (await tx.get(draftId)) as DataFloem
//     const newVersion = { ...draft, id: newVersionId }
//     const updatedVersionIds = [...project.versionIds, newVersionId]
//     const updatedProject = { ...project, versionIds: updatedVersionIds }
//     await Promise.all([
//       tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
//       tx.put(newVersionId, parseOrSkip(floemSchema, newVersion)),
//     ])
//   },

//   async resetDraftToVersion(tx: WriteTransaction, data: { projectId: string; versionId: string }) {
//     const { projectId, versionId } = data
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const { draftId } = project
//     const version = (await tx.get(versionId)) as DataFloem
//     if (!version) {
//       throw new Error(`No version with id ${versionId}`)
//     }
//     await tx.put(draftId, parseOrSkip(floemSchema, version))
//   },

//   async createAndDeploydeploymentFromDraft(
//     tx: WriteTransaction,
//     data: { projectId: string; newDeploymentId: string; newVersionId: string },
//   ) {
//     const { projectId, newDeploymentId, newVersionId } = data
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const existingVersion = (await tx.get(newVersionId)) as DataFloem
//     if (existingVersion) {
//       throw new Error(`Version with id ${newVersionId} already exists`)
//     }
//     const existingDeployment = (await tx.get(newDeploymentId)) as RepDeployment
//     if (existingDeployment) {
//       throw new Error(`Live version with id ${newDeploymentId} already exists`)
//     }
//     const { draftId } = project
//     const draft = (await tx.get(draftId)) as DataFloem
//     const newVersion = { ...draft, id: newVersionId }
//     const updatedVersionIds = [...project.versionIds, newVersionId]
//     const updatedProject = {
//       ...project,
//       versionIds: updatedVersionIds,
//       deploymentId: newDeploymentId,
//     }
//     const newDeployment: RepDeployment = {
//       id: newDeploymentId,
//       createdAt: Date.now(),
//       cachedFloem: newVersion,
//       live: true,
//     }
//     await Promise.all([
//       tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
//       tx.put(newVersionId, parseOrSkip(floemSchema, newVersion)),
//       tx.put(newDeploymentId, parseOrSkip(deploymentSchema, newDeployment)),
//     ])
//   },

//   async createAndDeploydeploymentFromVersion(
//     tx: WriteTransaction,
//     data: { projectId: string; newDeploymentId: string; versionId: string },
//   ) {
//     const { projectId, newDeploymentId, versionId } = data
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const existingDeployment = (await tx.get(newDeploymentId)) as RepDeployment
//     if (existingDeployment) {
//       throw new Error(`Live version with id ${newDeploymentId} already exists`)
//     }
//     const version = (await tx.get(versionId)) as DataFloem
//     if (!version) {
//       throw new Error(`No version with id ${versionId}`)
//     }
//     if (!project.versionIds.includes(versionId)) {
//       throw new Error(`Version ${versionId} is not part of project ${projectId}`)
//     }
//     const updatedProject = {
//       ...project,
//       deploymentId: newDeploymentId,
//     }
//     const newDeployment: RepDeployment = {
//       id: newDeploymentId,
//       createdAt: Date.now(),
//       cachedFloem: version,
//       live: true,
//     }
//     await Promise.all([
//       tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
//       tx.put(newDeploymentId, parseOrSkip(deploymentSchema, newDeployment)),
//     ])
//   },

//   async updatedeploymentFromDraft(
//     tx: WriteTransaction,
//     data: { projectId: string; newVersionId: string },
//   ) {
//     const { projectId, newVersionId } = data
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const { deploymentId } = project
//     if (!deploymentId) {
//       throw new Error(`No live version for project ${projectId}`)
//     }
//     const deployment = (await tx.get(deploymentId)) as RepDeployment

//     const existingVersion = (await tx.get(newVersionId)) as DataFloem
//     if (existingVersion) {
//       throw new Error(`Version with id ${newVersionId} already exists`)
//     }
//     const { draftId } = project
//     const draft = (await tx.get(draftId)) as DataFloem
//     const newVersion = { ...draft, id: newVersionId }
//     const updatedVersionIds = [...project.versionIds, newVersionId]
//     const updatedProject = {
//       ...project,
//       versionIds: updatedVersionIds,
//     }
//     const updatedDeployment = {
//       ...deployment,
//       cachedFloem: newVersion,
//       deployed: true,
//     }
//     await Promise.all([
//       tx.put(projectId, parseOrSkip(projectSchema, updatedProject)),
//       tx.put(newVersionId, parseOrSkip(floemSchema, newVersion)),
//       tx.put(deploymentId, parseOrSkip(deploymentSchema, updatedDeployment)),
//     ])
//   },

//   async updatedeploymentFromVersion(
//     tx: WriteTransaction,
//     data: { projectId: string; versionId: string },
//   ) {
//     const { projectId, versionId } = data
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const { deploymentId, versionIds } = project
//     if (!deploymentId) {
//       throw new Error(`No live version for project ${projectId}`)
//     }
//     if (!versionIds.includes(versionId)) {
//       throw new Error(`Version ${versionId} is not part of project ${projectId}`)
//     }
//     const deployment = (await tx.get(deploymentId)) as RepDeployment
//     const version = (await tx.get(versionId)) as DataFloem
//     if (!version) {
//       throw new Error(`No version with id ${versionId}`)
//     }
//     const updatedDeployment = {
//       ...deployment,
//       cachedFloem: version,
//       deployed: true,
//     }
//     await tx.put(deploymentId, parseOrSkip(deploymentSchema, updatedDeployment))
//   },

//   async undeploydeployment(tx: WriteTransaction, projectId: string) {
//     const project = (await tx.get(projectId)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${projectId}`)
//     }
//     const { deploymentId } = project
//     if (!deploymentId) {
//       throw new Error(`No live version for project ${projectId}`)
//     }
//     const deployment = (await tx.get(deploymentId)) as RepDeployment
//     const updatedDeployment = {
//       ...deployment,
//       deployed: false,
//     }
//     await tx.put(deploymentId, parseOrSkip(deploymentSchema, updatedDeployment))
//   },

//   async deleteProject(tx: WriteTransaction, id: string) {
//     const project = (await tx.get(id)) as RepProject
//     if (!project) {
//       throw new Error(`No project with id ${id}`)
//     }
//     const { draftId, deploymentId, versionIds } = project
//     await Promise.all([
//       tx.del(id),
//       tx.del(draftId),
//       deploymentId && tx.del(deploymentId),
//       ...versionIds.map(versionId => tx.del(versionId)),
//     ])
//   },
// }

// export const useWorkspaceRep = (id: string) => {
//   return useReplicache<WorkspaceMutators>({ name: id, mutators: workspaceMutators })
// }
