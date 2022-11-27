/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as esprima from 'esprima'
import { ObjectPattern, VariableDeclaration, FunctionExpression } from 'estree'

export const getDeclaredIdentifiers = (toEval: string): string[] => {
  const ast = esprima.parseModule(`const f = async function() {${toEval}}`)
  // this is undoing the wrapping function
  const variableDeclarations = (
    (ast.body![0]! as VariableDeclaration).declarations![0].init! as FunctionExpression
  ).body!.body!.filter(node => node.type === 'VariableDeclaration') as VariableDeclaration[]
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
