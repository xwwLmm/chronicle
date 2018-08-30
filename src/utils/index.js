/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export function isUrl(path) {
  return reg.test(path)
}

/**
 * '/route/path/example' => ['/route', '/route/path', 'route/path/example']
 * @param {*} url route path
 */
export function urlToList(url) {
  const urllist = url.split('/').filter(i => i)
  return urllist.map((urlItem, index) => {
    return `/${urllist.slice(0, index + 1).join('/')}`
  })
}
