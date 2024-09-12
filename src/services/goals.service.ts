import dayjs from "dayjs";
import { db } from "../db/index.ts";
import {
  goals,
  goalsCompletions,
} from "../db/schema.ts";
import {
  and,
  gte,
  lte,
  count,
  sql,
  eq,
  lt,
} from "drizzle-orm";

export interface CreateGoal {
  title: string;
  desiredWeeklyFrequency: number;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class GoalsService {
  static async createGoal({
    desiredWeeklyFrequency,
    title,
  }: CreateGoal) {
    const result = await db
      .insert(goals)
      .values({
        title,
        desiredWeeklyFrequency,
      })
      .returning();

    return {
      goal: result[0],
    };
  }

  static async getWeekPendingGoals() {
    const firstDayOfWeek = dayjs()
      .startOf("week")
      .toDate();
    const lastDayOfWeek = dayjs()
      .endOf("week")
      .toDate();

    const goalsCreatedUpToWeek = db
      .$with("goals_created_up_to_week")
      .as(
        db
          .select({
            id: goals.id,
            title: goals.title,
            desiredWeeklyFrequency:
              goals.desiredWeeklyFrequency,
            createdAt: goals.createdAt,
          })
          .from(goals)
          .where(
            lte(
              goals.createdAt,
              lastDayOfWeek
            )
          )
      );

    const goalCompletionCounts = db
      .$with("goal_completion_counts")
      .as(
        db
          .select({
            goalId:
              goalsCompletions.goalId,
            completionCount: count(
              goalsCompletions.id
            ).as("completionCount"),
          })
          .from(goalsCompletions)
          .where(
            and(
              gte(
                goalsCompletions.createdAt,
                firstDayOfWeek
              ),
              lte(
                goalsCompletions.createdAt,
                lastDayOfWeek
              )
            )
          )
          .groupBy(
            goalsCompletions.goalId
          )
      );

    const pendingGoals = await db
      .with(
        goalsCreatedUpToWeek,
        goalCompletionCounts
      )
      .select({
        id: goalsCreatedUpToWeek.id,
        title:
          goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency:
          goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql/*sql*/ `
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
      })
      .from(goalsCreatedUpToWeek)
      .where(
        lt(
          sql/*sql*/ `
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
          goalsCreatedUpToWeek.desiredWeeklyFrequency
        )
      )
      .leftJoin(
        goalCompletionCounts,
        eq(
          goalCompletionCounts.goalId,
          goalsCreatedUpToWeek.id
        )
      );

    return { pendingGoals };
  }
}
