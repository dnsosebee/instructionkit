import { MutatorDefs, Replicache } from 'replicache'
import { createDetailRepHelper } from '../../../pages/api/createDetailRep'
import { logger as parentLogger } from '../../logger'

const logger = parentLogger.child({ module: 'createSpaceUtil.ts' })

/**
 * Creates a new space after the parent is done syncing. "Ensures" that we keep the parent and child in sync (but not really)
 * @date 12/19/2022 - 7:55:57 PM
 *
 * @async
 * @template M extends MutatorDefs
 * @param {Replicache<M>} parentRep
 * @param {Replicache<M>['mutate'][string]} parentMutator
 * @param {*} parentMutatorArgs
 * @param {string} detailSpaceKey
 * @returns {Promise<boolean>}
 */
export const createSpaceUtil = async <M extends MutatorDefs>(
  parentRep: Replicache<M>,
  parentMutator: Replicache<M>['mutate'][string],
  parentMutatorArgs: any,
  detailSpaceKey: string,
): Promise<boolean> => {
  logger.debug('createSpaceUtil: creating space', { newSpaceId: detailSpaceKey })
  if (!parentRep.online) {
    logger.debug('createSpaceUtil: parentRep is offline')
    return false
  }
  await Promise.all([
    parentMutator(parentMutatorArgs),
    // let pending = true
    // while (pending) {
    //   const pendingMutations = await parentRep.experimentalPendingMutations()
    //   pending = pendingMutations.length > 0
    //   logger.debug('createSpaceUtil: pending mutations', { pendingMutations })
    // }
    createDetailRepHelper(detailSpaceKey),
  ])
  logger.debug('done', { detailSpaceKey })
  return true
}
