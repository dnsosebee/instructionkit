import { Replicache, WriteTransaction } from 'replicache'
import { useReplicache } from 'replicache-nextjs/lib/frontend'
import { z } from 'zod'
import { FloemChangeEvent } from '../../../../components/loaders/providers/flowchartProvider'
import { logger as parentLogger } from '../../../../lib/logger'
import { nextId, scopedKey } from '../../IdsAndKeys'
import { PROJECT_ID_LENGTH, PROJECT_KEY_PREFIX } from '../ws/entries/proj'
import { Dart, DARTS_KEY } from './entries/dart/dart'
import { Flow, flowKey, flowSchema, listFlows } from './entries/flow/flow'
import { START_FLOW_TYPE } from './entries/flow/types/start'

const logger = parentLogger.child({ module: 'projectMutators' })

export const PROJECT_SPACE_PREFIX = PROJECT_KEY_PREFIX
// for creating and accessing a project's replicache instance, we want to scope by workspaceId and projectId
// note that this is different from the projectKey within the workspaceRep, which is not scoped by workspaceId
export const projectSpaceKey = scopedKey(PROJECT_SPACE_PREFIX)
export const projectSpaceKeySchema = z
  .string()
  .startsWith(PROJECT_SPACE_PREFIX)
  .length(PROJECT_ID_LENGTH + PROJECT_SPACE_PREFIX.length)

export type ProjectMutators = typeof projectMutators
export type ProjectRep = Replicache<ProjectMutators>

export const useProjectRep = (workspaceId: string, projectId: string) => {
  return useReplicache({
    name: projectSpaceKey(workspaceId, projectId),
    mutators: projectMutators,
  })
}

export type FlowAndDartTransaction = {
  getFlow: (flowId: string) => Promise<Flow | undefined>
  putFlow: (flow: Flow) => Promise<void>
  delFlow: (flowId: string) => Promise<void>
  getDarts: () => Promise<Dart[]>
  putDarts: (darts: Dart[]) => Promise<void>
}

export const applyFlowAndDartChanges = async (
  tx: FlowAndDartTransaction,
  changes: FloemChangeEvent[],
) => {
  logger.info(`Applying floem changes: ${JSON.stringify(changes)}`)
  let prev: any
  let darts: Dart[]
  for (const change of changes) {
    switch (change.action) {
      case 'createFlow':
        prev = await tx.getFlow(change.flow.id)
        while (prev !== undefined) {
          logger.info('createFlow: flow already exists', change.flow, prev)
          change.flow = { ...change.flow, id: nextId(change.flow.id) }
          prev = await tx.getFlow(change.flow.id)
        }
        await tx.putFlow(flowSchema.parse(change.flow))
        break

      case 'updateFlow':
        prev = await tx.getFlow(change.update.id)
        if (prev !== undefined) {
          await tx.putFlow(flowSchema.parse({ ...prev, ...change.update }))
        } else {
          throw new Error(`updateFlow: flow not found ${change.update.id}`)
        }
        break

      case 'deleteFlow':
        prev = await tx.getFlow(change.id)
        if (prev !== undefined) {
          if (prev.type !== START_FLOW_TYPE) {
            await tx.delFlow(change.id)
          } else {
            throw new Error(`deleteFlow: cannot delete start flow ${change.id}`)
          }
        } else {
          throw new Error(`deleteFlow: flow not found ${change.id}`)
        }
        break

      case 'createDart':
        darts = (await tx.getDarts()) as Dart[]

        // make sure id is unique
        prev = darts.find(dart => dart.id === change.dart.id)
        while (prev !== undefined) {
          logger.info('createDart: dart already exists, replacing it.', change.dart, prev)
          change.dart = { ...change.dart, id: nextId(change.dart.id) }
          prev = darts.find(dart => dart.id === change.dart.id)
        }

        // make sure source is unique
        prev = darts.findIndex(
          dart => dart.from === change.dart.from && dart.case === change.dart.case,
        )

        if (prev !== -1) {
          darts = [...darts] // we need to make a copy so as not to mutate the original, Replicache disallows this
          darts[prev] = change.dart
          await tx.putDarts(darts)
        } else {
          await tx.putDarts([...darts, change.dart])
        }
        break

      case 'deleteDart':
        darts = (await tx.getDarts()) as Dart[]
        prev = darts.find(dart => dart.id === change.id)
        if (prev !== undefined) {
          darts = darts.filter(dart => dart.id !== change.id)
          await tx.putDarts(darts)
        } else {
          throw new Error(`deleteDart: dart not found ${change.id}`)
        }
        break

      default:
        throw new Error(`unexpected action ${change.action}`)
    }
  }
}

export const projectMutators = {
  async reset(tx: WriteTransaction, { flows, darts }: { flows: Flow[]; darts: Dart[] }) {
    // check that there's one start flow
    const startFlows = flows.filter(flow => flow.type === START_FLOW_TYPE)
    if (startFlows.length !== 1) {
      throw new Error(`reset: expected 1 start flow, got ${startFlows.length}`)
    }

    // check that flowIds are unique
    const flowIds = new Set(flows.map(flow => flow.id))
    if (flowIds.size !== flows.length) {
      throw new Error(`reset: duplicate flow ids`)
    }

    // check that dartIds are unique
    const dartIds = new Set(darts.map(dart => dart.id))
    if (dartIds.size !== darts.length) {
      throw new Error(`reset: duplicate dart ids`)
    }

    // check that all darts are to and from existing flows
    for (const dart of darts) {
      if (!flowIds.has(dart.from)) {
        throw new Error(`reset: dart from non-existent flow ${dart.from}`)
      }
      if (!flowIds.has(dart.to)) {
        throw new Error(`reset: dart to non-existent flow ${dart.to}`)
      }
    }

    // check that there's one dart per source
    const sources = new Set<string>()
    const source = (dart: Dart) => `${dart.from}-${dart.case}`
    for (const dart of darts) {
      if (sources.has(source(dart))) {
        throw new Error(`reset: duplicate dart source ${source(dart)}`)
      }
      sources.add(source(dart))
    }

    const prevFlows = await listFlows(tx)
    for (const flow of prevFlows) {
      await tx.del(flowKey(flow.id))
    }
    for (const flow of flows) {
      await tx.put(flowKey(flow.id), flowSchema.parse(flow))
    }
    await tx.put(DARTS_KEY, darts)
  },
  // flows
  async applyChanges(tx: WriteTransaction, changes: FloemChangeEvent[]) {
    const repTx: FlowAndDartTransaction = {
      getFlow: async (flowId: string) => {
        return (await tx.get(flowKey(flowId))) as Flow
      },
      putFlow: async (flow: Flow) => {
        await tx.put(flowKey(flow.id), flow)
      },
      delFlow: async (flowId: string) => {
        await tx.del(flowKey(flowId))
      },
      getDarts: async () => {
        return (await tx.get(DARTS_KEY)) as Dart[]
      },
      putDarts: async (darts: Dart[]) => {
        await tx.put(DARTS_KEY, darts)
      },
    }
    await applyFlowAndDartChanges(repTx, changes)
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
