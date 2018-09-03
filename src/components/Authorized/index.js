import Authorized from './Authorized'
import AuthorizedRoute from './AuthorizedRoute'
import check from './CheckPermissions'
import renderAuthorize from './RenderAuthorize'
import Secured from './Secured'

Authorized.Secured = Secured
Authorized.AuthorizedRoute = AuthorizedRoute
Authorized.check = check

export default renderAuthorize(Authorized)
