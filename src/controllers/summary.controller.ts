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
import SummaryService from "../services/summary.service.ts";

export default class SummaryController {
  private route: string;
  private app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.route = "/summary";
    this.app = app;
    this.registerRoutes();
  }

  private registerRoutes() {
    this.app.route({
      method: "GET",
      url: this.route,
      handler: this.get.bind(this),
    });
  }

  private async get(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const result =
        await SummaryService.getWeekSummary();

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
