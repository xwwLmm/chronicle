export default {
  namespace: 'layout',

  state: {
    collapsed: false, // 当前侧边菜单栏是否收缩
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      }
    },
  },
}
