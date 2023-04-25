import { Tag } from "@/components";
import colors from "@/colors";

import { FC, useMemo, useState } from "react";
import { ChartPie } from "../PieChart";
import styles from "./ChartWithTags.module.scss";

export interface IChartItem {
  id: string;
  title: string;
  totalAmount: number;
  amount: number;
}
export interface ITag extends IChartItem {
  color: string;
}

interface IProps {
  chartItems: IChartItem[];
}

export const ChartWithTags: FC<IProps> = ({ chartItems }) => {
  const chartItemTags = useMemo(
    () =>
    chartItems.map((item, idx) => ({
        ...item,
        color: colors[idx % colors.length],
      })),
    [chartItems]
  );
  const [activeTags, setActiveTags] = useState<ITag[]>(chartItemTags);

  return (
    <div className={styles.chartWithTags}>
      <ChartPie
        activeTags={activeTags}
      />
      <div className={styles.tags}>
        {chartItemTags.map(({ title }, idx) => {
          const currentCategory = chartItemTags.find(
            (tag) => tag.title === title
          )!;
          const isActive = !!activeTags.find((tag) => tag.title === title);
          return (
            <Tag
              key={idx}
              categoryTag={currentCategory}
              active={isActive}
              setActiveTags={setActiveTags}
            />
          );
        })}
      </div>
    </div>
  );
};
