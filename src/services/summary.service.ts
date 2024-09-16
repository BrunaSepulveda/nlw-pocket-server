import dayjs from "dayjs";
import GoalsService from "./goals.service.ts";
import { db } from "../db/index.ts";
import GoalsCompletionsService from "./goalsCompletions.service.ts";
import { sql } from "drizzle-orm";
import { Summary } from "../types/index.ts";

export default class SummaryService {
  public static async getWeekSummary(): Promise<Summary> {
    const firstDayOfWeek = dayjs()
      .startOf("week")
      .toDate();
    const lastDayOfWeek = dayjs()
      .endOf("week")
      .toDate();

    const goalsCreatedUpToWeek =
      GoalsService.goalsCreatedUpToWeek(
        lastDayOfWeek
      );

    const goalsCompletedInWeek =
      GoalsCompletionsService.goalsCompletedInWeek(
        {
          firstDayOfWeek,
          lastDayOfWeek,
        }
      );

    const goalsCompletedByWeekDay =
      GoalsCompletionsService.goalsCompletedByWeekDay(
        {
          firstDayOfWeek,
          lastDayOfWeek,
        }
      );

    const result = await db
      .with(
        goalsCreatedUpToWeek,
        goalsCompletedInWeek,
        goalsCompletedByWeekDay
      )
      .select({
        completed:
          sql/*sql*/ `(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
            Number
          ),
        total:
          sql/*sql*/ `(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
            Number
          ),
        goalsPerDay: sql/*sql*/ `
          JSON_OBJECT_AGG(
            ${goalsCompletedByWeekDay.completedAtDate},
            ${goalsCompletedByWeekDay.completions}
          )
        `,
      })
      .from(goalsCompletedByWeekDay);

    return {
      summary: result[0],
    } as Summary;
  }
}
