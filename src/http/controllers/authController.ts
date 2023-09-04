import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { authSchema } from '../schemas'
import { prisma } from '../../config'
import { compare, hash } from 'bcrypt'
import { ZodError } from 'zod'

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
      return res.status(400).send({
        error: (error as ZodError).errors[0].message
      })
    }
  },
  async login(req: FastifyRequest, res: FastifyReply) {
    try {
      const { email_username, password } = authSchema.login.parse(req.body)

      const user =
        (await prisma.user.findUnique({
          where: {
            email: email_username
          }
        })) ||
        (await prisma.user.findUnique({
          where: {
            username: email_username
          }
        }))

      if (!user) {
        return res.status(404).send({
          error: 'user not found'
        })
      }

      if (!(await compare(password, user?.password as string))) {
        return res.status(422).send({
          error: 'invalid credentials'
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

      return {
        token,
        message: `Bem-vindo ${user.first_name}!`
      }
    } catch (error) {
      return res.status(400).send({
        error: (error as ZodError).errors[0].message
      })
    }
  }
})
