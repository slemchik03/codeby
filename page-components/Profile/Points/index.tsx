import { ChartWithTags, IChartItem } from "@/page-components/ChartWithTags";
import { IScoreboardCategories } from "@/utils/server/get/getScoreboardCategories";
import { FC, useMemo } from "react";
import styles from "./Points.module.scss";

interface IProps {
  categoriesScoreboard: IScoreboardCategories;
}

export const Points: FC<IProps> = ({ categoriesScoreboard }) => {
  const chartItems: IChartItem[] = useMemo(() => {
    const items = categoriesScoreboard?.categories?.length
      ? categoriesScoreboard?.categories?.map(
          ({ title, id, all_tasks, completed_tasks }) => ({
            title,
            id,
            totalAmount: all_tasks,
            amount: completed_tasks,
          })
        )
      : [];
    return items;
  }, []);
  return (
    <div className={styles.points}>
      <ChartWithTags chartItems={chartItems} />
    </div>
  );
};
