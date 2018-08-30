import { isUrl } from '../utils'

const menuData = [
  {
    name: '审核',
    icon: 'dashboard',
    path: 'audit',
    children: [
      {
        name: '举报',
        path: 'report',
      },
      {
        name: '历史事件',
        path: 'history',
      },
    ],
  },
  {
    name: '管理',
    icon: 'tool',
    path: 'manage',
    children: [
      {
        name: '新增管理员',
        path: 'admin-new',
      },
    ],
  },
]

/**
 * 递归解析 menu, 拼接 path
 * @param {s} data menu list
 * @param {*} parentPath 父级 menu path
 * @param {*} parentAuthority 父级 menu 权限
 */
function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item
    if (!isUrl(path)) {
      path = parentPath + item.path
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    }
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority)
    }
    return result
  })
}

export const getMenu = () => formatter(menuData)
