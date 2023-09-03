import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastify from 'fastify'
import dotenv from 'dotenv'
import { routes } from '../routes'

const app = fastify()
dotenv.config()

const port = process.env.PORT ? Number(process.env.PORT) : 80
const host = process.env.HOST ? process.env.HOST : ''
const secret = process.env.JWT_SECRET || 'secret'

app.register(cors, {
  origin: true
})

app.register(jwt, {
  secret
})

app.register(routes, {
  prefix: '/api'
})

app
  .listen({
    port,
    host
  })
  .then(() => {
    console.log(`HTTP running on http://localhost:${port}`)
  })
