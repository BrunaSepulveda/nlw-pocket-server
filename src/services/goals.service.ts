import dayjs from 'dayjs'
import { db } from '../db/index'
import { goals, goalsCompletions } from '../db/schema'
import { and, gte, lte, count, sql, eq } from 'drizzle-orm'
import { CreateGoalParams, PendingGoal } from '../types/index'

export default class GoalsService {
  static async createGoal({ desiredWeeklyFrequency, title }: CreateGoalParams) {
    const result = await db
      .insert(goals)
      .values({
        title,
        desiredWeeklyFrequency,
      })
      .returning()

    return {
      goal: result[0],
    }
  }

  public static goalsCreatedUpToWeek(lastDayOfWeek: Date) {
    return db.$with('goals_created_up_to_week').as(
      db
        .select({
          id: goals.id,
          title: goals.title,
          desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
          createdAt: goals.createdAt,
        })
        .from(goals)
        .where(lte(goals.createdAt, lastDayOfWeek))
    )
  }

  static async getWeekPendingGoals(): Promise<{
    pendingGoals: Promise<PendingGoal[]>
  }> {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreatedUpToWeek =
      GoalsService.goalsCreatedUpToWeek(lastDayOfWeek)

    const goalCompletionCounts = db.$with('goal_completion_counts').as(
      db
        .select({
          goalId: goalsCompletions.goalId,
          completionCount: count(goalsCompletions.id).as('completionCount'),
        })
        .from(goalsCompletions)
        .where(
          and(
            gte(goalsCompletions.createdAt, firstDayOfWeek),
            lte(goalsCompletions.createdAt, lastDayOfWeek)
          )
        )
        .groupBy(goalsCompletions.goalId)
    )

    const pendingGoals = await db
      .with(goalsCreatedUpToWeek, goalCompletionCounts)
      .select({
        id: goalsCreatedUpToWeek.id,
        title: goalsCreatedUpToWeek.title,
        desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
        completionCount: sql /*sql*/`
          COALESCE(${goalCompletionCounts.completionCount}, 0)
        `.mapWith(Number),
      })
      .from(goalsCreatedUpToWeek)
      .leftJoin(
        goalCompletionCounts,
        eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
      )

    return {
      pendingGoals,
    } as unknown as {
      pendingGoals: Promise<PendingGoal[]>
    }
  }
}
