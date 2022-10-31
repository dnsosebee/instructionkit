/*global postMessage*/
import esprima from 'esprima'
import { ObjectPattern, VariableDeclaration } from 'estree'
import { logger as parentLogger } from '../../logger'

const logger = parentLogger.child({ module: 'worker' })

export type MessageToWorker = {
  toEval: string // can have escaped pointy brackets, or not
  context: { [key: string]: unknown }
  type: 'expression' | 'assign'
}

export type MessageFromWorker =
  | { result: unknown | { [key: string]: unknown } }
  | { error: unknown }

const newDeclaredIdentifiers = (toEval: string): string[] => {
  const ast = esprima.parseScript(toEval)
  const variableDeclarations = ast.body.filter(
    node => node.type === 'VariableDeclaration',
  ) as VariableDeclaration[]
  const assignedIdentifiers = variableDeclarations
    .map(node =>
      node.declarations.reduce((acc, decl) => {
        if (decl.id.type === 'Identifier') {
          acc.push(decl.id.name)
        }
        if (decl.id.type === 'ObjectPattern') {
          acc.push(...getIdentifiersRecursive(decl.id))
        }
        return acc
      }, [] as string[]),
    )
    .flat()
  return assignedIdentifiers
}

// recursive function to get all assigned identifiers in a nested destructuring assignment
const getIdentifiersRecursive = (ObjectPattern: ObjectPattern): string[] => {
  const assignedIdentifiers = ObjectPattern.properties.reduce((acc, prop) => {
    if (prop.type === 'Property' && prop.value.type === 'ObjectPattern') {
      acc.push(...getIdentifiersRecursive(prop.value))
    } else if (prop.type === 'Property' && prop.key.type === 'Identifier') {
      acc.push(prop.key.name)
    }
    return acc
  }, [] as string[])
  return assignedIdentifiers
}

const assignContextCode = (
  context: { [key: string]: unknown },
  contextArgName = 'context',
): string => {
  logger.debug('assignContextCode', { context })
  return Object.keys(context)
    .map(k => `let ${k} = ${contextArgName}.${k}`)
    .join('; ')
}

const retrieveContextCode = (context: { [key: string]: unknown }, toEval: string): string => {
  const keys = Object.keys(context)
  const newlyAssignedIdentifiers = newDeclaredIdentifiers(toEval)
  const dedupedIdentifiers = [...new Set([...keys, ...newlyAssignedIdentifiers])]
  return `return {${dedupedIdentifiers.map(k => `${k}`).join(', ')}}`
}

const evalExpression = (toEval: string, context: { [key: string]: unknown }): unknown => {
  logger.debug('evalExpression', { toEval, context })
  const code = `${assignContextCode(context)}; return ${toEval}`
  logger.debug('evalExpression code', code)
  return Function('context', code)(context)
}

const evalAssign = (
  toEval: string,
  context: { [key: string]: unknown },
): { [key: string]: unknown } => {
  logger.debug('evalAssign', { toEval, context })
  const code = ` ${assignContextCode(context)} ${toEval}; ${retrieveContextCode(context, toEval)}`
  logger.debug('evalAssign code', code)
  return Function('context', code)(context)
}

onmessage = (e: MessageEvent<MessageToWorker>) => {
  const { toEval, context, type } = e.data
  logger.debug('onmessage', { toEval, context, type })
  const toEvalUnescaped = toEval.replaceAll(/&lt;/g, '<').replaceAll(/&gt;/g, '>')
  let result: MessageFromWorker
  try {
    if (type === 'expression') {
      result = { result: evalExpression(toEvalUnescaped, context) }
    } else if (type === 'assign') {
      result = { result: evalAssign(toEvalUnescaped, context) }
    } else {
      throw new Error(`Unknown type: ${type}`)
    }
  } catch (e: unknown) {
    result = { error: e }
  }
  logger.debug('onmessage result', result)
  postMessage(result)
}
