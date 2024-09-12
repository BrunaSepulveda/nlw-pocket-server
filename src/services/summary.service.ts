import dayjs from "dayjs";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export default class SummaryService {
  static async getWeekSummary() {
    const firstDayOfWeek = dayjs()
      .startOf("week")
      .toDate();

    const lastDayOfWeek = dayjs()
      .endOf("week")
      .toDate();

    // const goalsCreatedUpToWeek =
    //   GoalsService.getWeekPendingGoals(
    //     lastDayOfWeek
    //   );

    // const goalsCompletedByWeekDay =
    //   GoalsCompletionsService.goalsCompletedByWeekDay(
    //     {
    //       firstDayOfWeek,
    //       lastDayOfWeek,
    //     }
    //   );

    // const result = await db
    //   .select()
    //   .from(goalsCreatedUpToWeek);

    return {
      summary: "teste",
    };
  }
}
/*

*/
