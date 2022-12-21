import { RootHandler } from '../../../src/components/loaders/routesHandlers/rootHandler'
import { setRoute } from '../../../src/lib/route'

const ResetPasswordPage = () => {
  setRoute({ route: `/app/profile/reset-password`, replace: false })
  return <RootHandler />
}

export default ResetPasswordPage
