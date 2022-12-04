import { AppPage } from '../../src/components/layout/appLayout'
import AppProvider from '../../src/components/layout/appProvider'
import SupaProvider, { AuthState } from '../../src/components/layout/supaProvider'

export default () => {
  // expect to redirect URL within AppProvider
  return (
    <SupaProvider intendedAuthState={AuthState.SignedIn}>
      <AppProvider workspaceId={null} selectedPage={AppPage.Projects}>
        <></>
      </AppProvider>
    </SupaProvider>
  )
}
