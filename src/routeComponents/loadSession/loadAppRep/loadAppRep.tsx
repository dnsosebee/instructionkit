import { AppRep, useAppRep } from '../../../model/replicache/spaces/app/appMutators'
import { Blink } from '../../blink'
import { ActionSubroute } from '../../route'
import { SessionContext } from '../loadSession'

export type LoadAppRepSubroute = ActionSubroute<{
  name: 'loadAppRep'
  subActions: []
}>

export type LoadAppRepProps = SessionContext & {
  route: LoadAppRepSubroute
}

export type AppRepContext = { appRep: AppRep } & SessionContext

export default ({ route, session }: LoadAppRepProps) => {
  const appRep = useAppRep()
  if (!appRep) {
    return <>Loading appRep</>
  }
  return (
    <>
      App rep loaded
      <Blink url='https://www.youtube.com/watch?v=dQw4w9WgXcQ' callback={() => alert('hi')}>
        Test Blink
      </Blink>
    </>
  )
}

// const LoadAppRep = ({ route, session, appRep }: LoadAppRepProps & {appRep: AppRep}) => {
