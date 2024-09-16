interface GoalsPerDayInfo {
  id: string;
  title: string;
  completedAt: Date;
}

interface Summary {
  summary: {
    completed: number;
    total: number;
    goalsPerDay: Record<
      string,
      GoalsPerDayInfo[]
    >;
  };
}

interface GoalCompletion {
  id: string;
  createdAt: Date;
  goalId: string;
}

interface GoalCompletionPropertiesToCompare {
  desiredWeeklyFrequency: number;
  completionCount: number;
}

interface Goal {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  createdAt: Date;
}

interface PendingGoal {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}

interface CreateGoalCompletionRequest {
  goalId: string;
}

interface GoalCompletionCountsParams
  extends CreateGoalCompletionRequest {
  firstDayOfWeek: Date;
  lastDayOfWeek: Date;
}

interface CreateGoalParams {
  title: string;
  desiredWeeklyFrequency: number;
}

export {
  GoalsPerDayInfo,
  Summary,
  GoalCompletion,
  GoalCompletionPropertiesToCompare,
  Goal,
  PendingGoal,
  CreateGoalCompletionRequest,
  GoalCompletionCountsParams,
  CreateGoalParams,
};
