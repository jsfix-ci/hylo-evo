import setupStartTime from './setup' // this must be first
import './newrelic' // this must be second
import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import appMiddleware from './appMiddleware'
import apiProxy from './apiProxy'
import redirectToApp from './redirectToApp'
import { handleStaticPages } from './proxy'

const port = process.env.PORT || 9001

export default function () {
  const server = express()
  server.use(cookieParser())
  server.use(compression())
  // Enable pre-flight CORS
  const corsOptions = {
    origin: '*', //['https://hylo.com','https://api.hylo.com','https://staging.hylo.com','https://localhost:3000', 'https://localhost:3000', 'http://localhost:4000', 'https://localhost:3001']
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: true
  }
  server.options('*', cors(corsOptions)) // include before other routes
  server.use(cors(corsOptions))
  server.use(apiProxy)
  server.use(redirectToApp)
  handleStaticPages(server)
  server.use(express.static('build'))
  server.use(appMiddleware)

  const listener = server.listen(port, err => {
    if (err) throw err
    const elapsed = new Date().getTime() - setupStartTime
    console.log(`listening on port ${port} after ${elapsed}ms (pid ${process.pid})`)
  })

  function shutdown () {
    const waitForClose = process.env.NODE_ENV === 'production'
      ? listener.close.bind(listener)
      : fn => fn()
    waitForClose(() => {
      console.log(`shutting down (pid ${process.pid})`)
      process.exit()
    })
  }
  process.once('SIGINT', shutdown)
  process.once('SIGUSR2', shutdown) // used by nodemon

  return listener
}
