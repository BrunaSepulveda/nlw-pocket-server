import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import GoalsService, {
  type CreateGoal,
} from "../services/goals.service.ts";
import type {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";

export default class GoalsController {
  private route: string;
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.route = "/goals";
    this.app = app;
    this.registerRoutes();
  }

  private registerRoutes() {
    this.app.route({
      method: "POST",
      url: this.route,
      schema: {
        body: z.object({
          title: z.string(),
          desiredWeeklyFrequency: z
            .number()
            .int()
            .min(1)
            .max(7),
        }),
      },
      handler: this.post.bind(this),
    });

    this.app.route({
      method: "GET",
      url: `${this.route}/pending-goals`,
      handler:
        this.getWeekPendingGoals.bind(
          this
        ),
    });
  }

  private async post(
    request: FastifyRequest<{
      Body: CreateGoal;
    }>,
    reply: FastifyReply
  ) {
    try {
      const body = request.body;
      const result =
        await GoalsService.createGoal(
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

  private async getWeekPendingGoals(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result =
        await GoalsService.getWeekPendingGoals();

      reply
        .code(StatusCodes.OK)
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
