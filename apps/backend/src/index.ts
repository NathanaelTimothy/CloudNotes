import 'reflect-metadata'

import Koa from 'koa'
import Router from '@koa/router'
import mount from 'koa-mount'
import {z} from 'zod'
import cors from '@koa/cors'

import routesApi from './routes/api'
import {env} from './env'
import {setupDB} from './db'

const app = new Koa()
app.use(cors())

const router = new Router()

async function checkEnv() {
  try {
    await env.validate()
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.warn('\nPassed environment variables are wrong:')
      for (let [key, val] of Object.entries(e.format())) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any = val
        if (key !== '_errors') {
          console.warn(
            `- ${key}, errors: ${value['_errors'].join(', ')}`,
          )
        }
      }
      console.log('\n')
    }
    process.exit(1)
  }
}

async function start() {
  await checkEnv()

  setupDB()

  router.get('/', async ctx => {
    ctx.body = "Whatchu doin' here"
  })

  app.use(router.routes()).use(router.allowedMethods())
  app.use(mount('/api', routesApi()))

  app.listen(env.PORT, env.HOST, () => {
    console.log(`⚡️[server]: Server is running at ${env.DOMAIN}`)
  })
}

start()
