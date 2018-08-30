export default {
  namespace: 'user',

  state: {
    current: {
      name: 'Sun Reaver',
      avatar: 'https://blog-1252181333.cossh.myqcloud.com/blog/avatar.png'
    },
  },

  reducers: {
    changeNotifyCount(state, action) {
      return {
        ...state,
        current: {
          ...state.current,
          notifyCount: action.payload,
        },
      }
    },
  },
}