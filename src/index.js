import dva from 'dva'
import createHistory from 'history/createBrowserHistory'
import createLoading from 'dva-loading'
import 'normalize.css'
import './index.less'

const app = dva({
  history: createHistory({
    basename: '/chronicle'
  }),
})

// 2. Plugins
app.use(createLoading())

// 3. Register layout model
app.model(require('./models/layout').default)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')

export default app._store // eslint-disable-line
