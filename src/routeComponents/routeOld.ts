// import { proxy } from 'valtio'

// // export type ZRoute = z.ZodObject<{
// //   name: z.ZodLiteral<string>
// //   subRoutes?: z.ZodArray<ZRoute>
// // } & (
// //   | { paramName: z.ZodLiteral<string>; urlExtension?: z.ZodUndefined }
// //   | { paramName?: z.ZodUndefined; urlExtension: z.ZodLiteral<string> }
// // )>

// // const zRoute = z.object({
// //   name: z.literal("name1"),
// //   subRoutes: z.array(z.object({
// //     name: z.literal("name2"),
// //     urlExtension: z.literal("urlExtension2"),
// //   })),
// //   paramName: z.literal("paramName1"),
// // })

// // const getUrl = (route: ZRoute) => {
// //   return (route.shape.urlExtension ? `/${route.shape.urlExtension}` : "") + (route.subRoutes ? route.subRoutes.map(getUrl).join("") : "")

// export type Rou = {
//   params: Record<string, string>
//   branches: Record<string, string>
// }

// export const nullRoute: Rou = {
//   params: {},
//   branches: {},
// }

// export type RouteDef = {subRoutes: SubRouteDef[] } | {paramName: string, subRoute: SubRouteDef} | true

//   export type SubRouteDef = [string, RouteDef]

// export type Route<T extends RouteDef> = T extends true ? unknown :
//   T extends {paramName: string, subRoute: SubRouteDef} ? {params: Record<T['paramName'], string>, branches: {[K in T['subRoute'][0]]: Route<T['subRoute'][1]>}} :

// const urlToRoute = (url: string, routeDef: RouteDef) => {
//   if (routeDef === true) {
//     if (url === '') {

//   if ('subRoutes' in routeDef) {
//     const subRoute = Object.entries(routeDef.subRoutes).find(([name, subRouteDef]) => {
//       if (subRouteDef === null) {
//         return url.startsWith(`/${name}`)
//       } else {
// }

// const routeToUrl = (route: Route, routeDef: RouteDef) => {
// }

// // export type Route<
// //   T extends {
// //     name: string
// //     subRoutes?: T[]
// //   } & (
// //     | { paramName: string; urlExtension?: undefined }
// //     | { paramName?: undefined; urlExtension: string }
// //   ),
// // > = {
// //   params: (T['paramName'] extends string ? Record<T['paramName'], string> : Record<string, never>) &
// //     (T['subRoutes'] extends T[]? [K in T['subRoutes'][number]['params']] : unknown)
// //   // branches: (T['subRoutes'] extends Route<any>[] ? { [K in T['subRoutes'][number]['name']]: T['subRoutes'][number] } : unknown) & {

// // }
// // type R = Route<{
// //   name: 'r1'
// //   paramName: 'r1Param'
// //   subRoutes: [
// //       Route<{
// //         name: 'r2'
// //         paramName: 'r2Param'
// //       }>,
// //   ]
// // }>

// // const r: R = {
// //   params: {
// //     r1Param: 'r1Param',
// //     r2Param: 'r2Param',
// //   },
// // }

// type RouteState =
//   | { route: 'accessFallbackWorkspace'; params: Record<string, never> }
//   | { route: 'accessWorkspace'; params: { workspaceId: string } }
//   | { route: 'viewWorkspaceProjects'; params: { workspaceId: string } }
//   | { route: 'viewWorkspaceSettings'; params: { workspaceId: string } }
//   | { route: 'viewProjectDraft'; params: { workspaceId: string; projectId: string } }
//   | { route: 'viewProjectPreview'; params: { workspaceId: string; projectId: string } }

export {}
