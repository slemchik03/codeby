import { Card, ChartWithTags, IChartItem, PointsCard } from "@/page-components";
import styles from "./AdminInfo.module.scss";
import { IStatisticTasks } from "@/utils/server/get/getStatisticTasks";
import { IStatisticUsers } from "@/utils/server/get/getStatisticUsers";
import { IStatisticCompletedTasks } from "@/utils/server/get/getStatisticCompletedTasks";
import { IStatisticCategories } from "@/utils/server/get/getStatisticCategories";
import { FC, useMemo } from "react";

interface IProps {
  statisticTasks: IStatisticTasks;
  statisticUsers: IStatisticUsers;
  statisticCompletedTasks: IStatisticCompletedTasks;
  statisticCategories: IStatisticCategories;
}

export const AdminInfo: FC<IProps> = ({
  statisticCategories,
  statisticCompletedTasks,
  statisticTasks,
  statisticUsers,
}) => {
  const chartItemsData = useMemo(
    () =>
      statisticCategories?.categories?.reduce(
        (acc, val) => ({
          totalPointsAmount: acc.totalPointsAmount + val.points,
          totalTasksAmount: acc.totalTasksAmount + val.tasks,
        }),
        { totalPointsAmount: 0, totalTasksAmount: 0 }
      ),
    []
  );
  const chartItems = useMemo(() => {
    const pointsChartItemData: IChartItem[] = [];
    const tasksChartItemData: IChartItem[] = [];

    statisticCategories?.categories?.forEach(({ title, id, tasks, points }) => {
      pointsChartItemData.push({
        title,
        id,
        totalAmount: chartItemsData.totalPointsAmount,
        amount: points,
      });
      tasksChartItemData.push({
        title,
        id,
        totalAmount: chartItemsData.totalTasksAmount,
        amount: tasks,
      });
    });

    return {
      pointsChartItemData,
      tasksChartItemData
    }
  }, []);

  return (
    <div className={styles.adminInfo}>
      <Card className={styles.tasks} title="Задания">
        <PointsCard value={statisticTasks.records} title="Количество" />
        <PointsCard
          className={styles.done}
          value={statisticCompletedTasks.records}
          title="Решено"
        />
      </Card>
      <Card
        className={styles.tasksChart}
        title="Количество заданий по категориям"
      >
        <ChartWithTags chartItems={chartItems.tasksChartItemData} />
      </Card>
      <Card className={styles.points} title="Баллы">
        <PointsCard
          className={styles.totalPoints}
          title="Всего"
          value={statisticCategories?.categories?.reduce(
            (acc, val) => val.points + acc,
            0
          )}
        />
        <PointsCard title="Заработано" value={statisticCompletedTasks.points} />
      </Card>
      <Card
        className={styles.pointsChart}
        title="Количество баллов по категориям"
      >
        <ChartWithTags chartItems={chartItems.pointsChartItemData} />
      </Card>
      <Card className={styles.amount}>
        <PointsCard
          className={styles.totalUsers}
          title="Всего пользователей"
          value={statisticUsers.records}
        />
        <PointsCard
          title="Количество категорий"
          value={statisticCategories.records}
        />
      </Card>
    </div>
  );
};
