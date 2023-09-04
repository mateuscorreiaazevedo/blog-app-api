import { FastifyInstance } from 'fastify'
import { authRoute } from './authRoute'

export async function authenticatedRoutes(app: FastifyInstance) {
  app.register(authRoute, { prefix: '/auth' })
}
