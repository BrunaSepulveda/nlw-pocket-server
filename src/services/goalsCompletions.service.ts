import {
  and,
  count,
  eq,
  gte,
  lte,
  sql,
} from "drizzle-orm";
import dayjs from "dayjs";
import { db } from "../db/index.ts";
import {
  goals,
  goalsCompletions,
} from "../db/schema.ts";

interface CreateGoalCompletionRequest {
  goalId: string;
}

interface GoalCompletionCountsParams
  extends CreateGoalCompletionRequest {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class GoalsCompletionsService {
  private static goalCompletionCounts({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalCompletionCountsParams) {
    return db
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
              ),
              eq(
                goalsCompletions.goalId,
                goalId
              )
            )
          )
          .groupBy(
            goalsCompletions.goalId
          )
      );
  }

  private static async getPropertiesToCompare(
    params: GoalCompletionCountsParams
  ): Promise<{
    desiredWeeklyFrequency: number;
    completionCount: number;
  }> {
    const goalCompletionCounts =
      GoalsCompletionsService.goalCompletionCounts(
        params
      );

    const result = await db
      .with(goalCompletionCounts)
      .select({
        desiredWeeklyFrequency:
          goals.desiredWeeklyFrequency,
        completionCount: sql`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
      })
      .from(goals)
      .leftJoin(
        goalCompletionCounts,
        eq(
          goalCompletionCounts.goalId,
          goals.id
        )
      )
      .where(
        eq(goals.id, params.goalId)
      )
      .limit(1);

    return result[0];
  }

  public static async createGoalCompletion({
    goalId,
  }: CreateGoalCompletionRequest) {
    const firstDayOfWeek = dayjs()
      .startOf("week")
      .toDate();
    const lastDayOfWeek = dayjs()
      .endOf("week")
      .toDate();

    const {
      completionCount,
      desiredWeeklyFrequency,
    } =
      await GoalsCompletionsService.getPropertiesToCompare(
        {
          firstDayOfWeek,
          goalId,
          lastDayOfWeek,
        }
      );

    if (
      completionCount >=
      desiredWeeklyFrequency
    ) {
      throw new Error(
        "Goal already completed this week!"
      );
    }

    const insertResult = await db
      .insert(goalsCompletions)
      .values({ goalId })
      .returning();

    const goalCompletion =
      insertResult[0];

    return {
      goalCompletion,
    };
  }
}
