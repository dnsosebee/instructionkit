import { ReadTransaction } from 'replicache'
import { Deployment, deploymentSchema } from '../../../../../schema/types/deployment'

export const DEPLOYMENT_KEY = 'deploy'

export const getDeployment = async (tx: ReadTransaction): Promise<Deployment | null> => {
  const v = await tx.get(DEPLOYMENT_KEY)
  return deploymentSchema.parse(v)
}

export type DeploymentUpdate = Omit<Partial<Deployment>, 'createdAt'>
