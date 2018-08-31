export default {
  namespace: 'notice',

  state: {
    count: 3,
    list: [
      {
        id: '0',
        avatar: 'https://blog-1252181333.cossh.myqcloud.com/blog/avatar.png',
        title: '你有一个通知',
        datetime: '2018-08-09',
        type: 'notice',
      },
      {
        id: '1',
        avatar: 'https://blog-1252181333.cossh.myqcloud.com/blog/avatar.png',
        title: '你有一个审核',
        description: '有历史事件待审核',
        datetime: '2018-08-10',
        type: 'message',
      },
      {
        id: '2',
        title: '你有一个举报待处理',
        description: '谈笑风声',
        extra: '未开始',
        status: 'todo',
        type: 'todo',
      },
    ],
  },

  effects: {
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload
      })
      const count = yield select(state => state.notice.list.length)
      yield put({
        type: 'user/changeNotifyCount',
        payload: count
      })
    }
  },

  reducers: {
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        list: state.list.filter(notice => notice.type !== payload),
      }
    },
  },
}
