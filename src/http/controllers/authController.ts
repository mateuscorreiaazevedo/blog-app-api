import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { authSchema } from '../schemas'
import { prisma } from '../../config'
import { hash } from 'bcrypt'

export const authController = (app?: FastifyInstance) => ({
  async register(req: FastifyRequest, res: FastifyReply) {
    try {
      const { confirm_password, email, first_name, last_name, password, username } =
        authSchema.register.parse(req.body)

      let user =
        (await prisma.user.findUnique({
          where: {
            email
          }
        })) ||
        (await prisma.user.findUnique({
          where: {
            username
          }
        }))

      if (user) {
        res.status(422).send({
          error: 'username or email already used'
        })
        return
      }

      if (confirm_password !== password) {
        res.status(422).send({
          error: 'confirm password and password is not matching'
        })
        return
      }

      user = await prisma.user.create({
        data: {
          email,
          first_name,
          last_name,
          username,
          password: await hash(password, 10)
        }
      })

      if (!user) {
        res.status(500).send({
          error: 'server error'
        })
      }

      const token = (app as FastifyInstance).jwt.sign(
        {
          id: user.id
        },
        {
          expiresIn: '30 days'
        }
      )

      return res.status(201).send({
        token,
        message: `Bem-vindo ${user.first_name}`
      })
    } catch (error) {
      return error as Error
    }
  }
})
