import { compact } from 'lodash'
import { applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import graphqlMiddleware from './graphql'
import apiMiddleware from './apiMiddleware'
import pendingMiddleware from './pendingMiddleware'
import optimisticMiddleware from './optimisticMiddleware'
import errorMiddleware from 'store/middleware/errorMiddleware'
import { routerMiddleware } from 'react-router-redux'
import extractModelMiddleware from './extractModel'

export default function createMiddleware (history) {
  const middleware = compact([
    routerMiddleware(history),
    graphqlMiddleware,
    apiMiddleware(),
    errorMiddleware(),
    extractModelMiddleware,
    optimisticMiddleware,
    pendingMiddleware,
    promiseMiddleware,
    process.env.NODE_ENV === 'development' && createLogger({collapsed: true})
  ])

  const composeFn = typeof __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined'
    ? __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
    : compose

  return composeFn(
    applyMiddleware(...middleware)
  )
}
