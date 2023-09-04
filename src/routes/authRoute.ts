import { FastifyInstance } from 'fastify'
import { authController } from '../http'

export async function authRoute(app: FastifyInstance) {
  app.post('/register', authController(app).register)
  app.post('/login', authController(app).login)
}
