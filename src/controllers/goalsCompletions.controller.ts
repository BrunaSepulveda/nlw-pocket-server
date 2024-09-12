import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import { z } from "zod";
import GoalsCompletionsService from "../services/goalsCompletions.service.ts";
import { StatusCodes } from "http-status-codes";

export default class GoalsCompletionsController {
  private route: string;
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.route = "/completions";
    this.app = app;
    this.registerRoutes();
  }

  private registerRoutes() {
    this.app.route({
      method: "POST",
      url: this.route,
      schema: {
        body: z.object({
          goalId: z.string(),
        }),
      },
      handler: this.post.bind(this),
    });
  }

  private async post(
    request: FastifyRequest<{
      Body: { goalId: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body;
      const result =
        await GoalsCompletionsService.createGoalCompletion(
          body
        );

      reply
        .code(StatusCodes.CREATED)
        .send(result);
    } catch (error) {
      reply
        .code(StatusCodes.BAD_REQUEST)
        .send({
          error: "Invalid request",
          message: (error as Error)
            .message,
        });
    }
  }
}
