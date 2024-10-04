import dayjs from 'dayjs'
import { client, db } from './index'
import { goals, goalsCompletions } from './schema'

async function seed() {
  await db.delete(goalsCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Acordar cedo',
        desiredWeeklyFrequency: 5,
      },
      {
        title: 'Exercitar',
        desiredWeeklyFrequency: 3,
      },
      {
        title: 'Meditar',
        desiredWeeklyFrequency: 1,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalsCompletions).values([
    {
      goalId: result[2].id,
      createdAt: startOfWeek.toDate(),
    },
  ])
}

seed().finally(() => client.end())
