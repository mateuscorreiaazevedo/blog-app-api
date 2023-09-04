import { z } from 'zod'

export const authSchema = {
  register: z.object({
    email: z.string().nonempty('field required.').email('invalid email.'),
    username: z.string().nonempty('field required.'),
    first_name: z.string().nonempty('field required.'),
    last_name: z.string().nonempty('field required.'),
    password: z.string().nonempty('field required.'),
    confirm_password: z.string().nonempty('field required.')
  })
}
