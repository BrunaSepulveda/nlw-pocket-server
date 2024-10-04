import { and, count, eq, gte, lte, sql } from 'drizzle-orm'
import dayjs from 'dayjs'
import { db } from '../db/index'
import { goals, goalsCompletions } from '../db/schema'
import {
  CreateGoalCompletionRequest,
  GoalCompletion,
  GoalCompletionCountsParams,
  GoalCompletionPropertiesToCompare,
} from '../types/index'

export default class GoalsCompletionsService {
  private static goalCompletionCounts({
    goalId,
    firstDayOfWeek,
    lastDayOfWeek,
  }: GoalCompletionCountsParams) {
    return db.$with('goal_completion_counts').as(
      db
        .select({
          goalId: goalsCompletions.goalId,
          completionCount: count(goalsCompletions.id).as('completionCount'),
        })
        .from(goalsCompletions)
        .where(
          and(
            gte(goalsCompletions.createdAt, firstDayOfWeek),
            lte(goalsCompletions.createdAt, lastDayOfWeek),
            eq(goalsCompletions.goalId, goalId)
          )
        )
        .groupBy(goalsCompletions.goalId)
    )
  }

  private static async getPropertiesToCompare(
    params: GoalCompletionCountsParams
  ): Promise<GoalCompletionPropertiesToCompare> {
    const goalCompletionCounts =
      GoalsCompletionsService.goalCompletionCounts(params)

    const result = await db
      .with(goalCompletionCounts)
      .select({
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        completionCount: sql`
        COALESCE(${goalCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
      })
      .from(goals)
      .leftJoin(goalCompletionCounts, eq(goalCompletionCounts.goalId, goals.id))
      .where(eq(goals.id, params.goalId))
      .limit(1)

    return result[0]
  }

  public static async createGoalCompletion({
    goalId,
  }: CreateGoalCompletionRequest): Promise<{
    goalCompletion: GoalCompletion
  }> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const { completionCount, desiredWeeklyFrequency } =
      await GoalsCompletionsService.getPropertiesToCompare({
        firstDayOfWeek,
        goalId,
        lastDayOfWeek,
      })

    if (completionCount >= desiredWeeklyFrequency) {
      throw new Error('Goal already completed this week!')
    }

    const insertResult = await db
      .insert(goalsCompletions)
      .values({ goalId })
      .returning()

    const goalCompletion: GoalCompletion = insertResult[0]

    return {
      goalCompletion,
    }
  }

  public static goalsCompletedInWeek(params: {
    firstDayOfWeek: Date
    lastDayOfWeek: Date
  }) {
    return db.$with('goals_completed_in_week').as(
      db
        .select({
          id: goalsCompletions.id,
          title: goals.title,
          completedAt: goalsCompletions.createdAt,
          completedAtDate: sql /*sql*/`
          DATE(${goalsCompletions.createdAt})
        `.as('completedAtDate'),
        })
        .from(goalsCompletions)
        .innerJoin(goals, eq(goals.id, goalsCompletions.goalId))
        .where(
          and(
            gte(goalsCompletions.createdAt, params.firstDayOfWeek),
            lte(goalsCompletions.createdAt, params.lastDayOfWeek)
          )
        )
    )
  }

  public static goalsCompletedByWeekDay(params: {
    firstDayOfWeek: Date
    lastDayOfWeek: Date
  }) {
    const goalsCompletedInWeek =
      GoalsCompletionsService.goalsCompletedInWeek(params)
    return db.$with('goals_completed_by_week_day').as(
      db
        .select({
          completedAtDate: goalsCompletedInWeek.completedAtDate,
          completions: sql /*sql*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as('completions'),
        })
        .from(goalsCompletedInWeek)
        .groupBy(goalsCompletedInWeek.completedAtDate)
    )
  }

  public static async delete({
    id,
  }: {
    id: string
  }) {
    await db.delete(goalsCompletions).where(eq(goalsCompletions.id, id))
  }
}
