import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import GoalsController from '../controllers/goals.controller'
import GoalsCompletionsController from '../controllers/goalsCompletions.controller'
import SummaryController from '../controllers/summary.controller'
import fastifyCors from '@fastify/cors'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

new GoalsController(app)
new GoalsCompletionsController(app)
new SummaryController(app)

app.register(fastifyCors, {
  origin: '*',
})

app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  console.log(`Server is now listening on ${address}`)
})
