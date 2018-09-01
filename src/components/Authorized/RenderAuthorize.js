/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL'
/**
 * 权限检查的中间层, 缓存当前用户权限
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = Authorized => {
  return currentAuthority => {
    if (currentAuthority) {
      if (currentAuthority.constructor.name === 'Function') {
        CURRENT = currentAuthority()
      }
      if (
        currentAuthority.constructor.name === 'String' ||
        currentAuthority.constructor.name === 'Array'
      ) {
        CURRENT = currentAuthority
      }
    } else {
      CURRENT = 'NULL'
    }
    return Authorized
  }
}

export { CURRENT }
export default Authorized => renderAuthorize(Authorized)
