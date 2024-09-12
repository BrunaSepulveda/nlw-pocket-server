import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

import GoalsController from "../controllers/goals.controller.ts";
import GoalsCompletionsController from "../controllers/goalsCompletions.controller.ts";
import SummaryController from "../controllers/summary.controller.ts";

export const app =
  fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(
  validatorCompiler
);
app.setSerializerCompiler(
  serializerCompiler
);

new GoalsController(app);
new GoalsCompletionsController(app);
new SummaryController(app);

app.listen(
  { port: 3333 },
  (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(
      `Server is now listening on ${address}`
    );
  }
);
