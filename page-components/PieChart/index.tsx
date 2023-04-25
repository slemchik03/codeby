
import React, { FC, useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { ITag } from "../ChartWithTags";

interface IProps {
  activeTags: ITag[];
}

export const ChartPie: FC<IProps> = ({ activeTags }) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const data = useMemo(() => {
    return activeTags?.map(({ totalAmount, amount, color }) => {
      if (totalAmount !== amount) {
        return {
          value: Math.min(
            Math.round(amount / (totalAmount / 100)),
            100
          ),
          tagColor: color
        };
      } else {
        return {
          value: 100,
          tagColor: color
        };
      }
    }) 
  }, [activeTags]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        cx={100}
        cy={130}
        innerRadius={60}
        outerRadius={80}
        dataKey="value"
      >
        {data?.map((tag, idx) => (
          <Cell key={`cell-${idx}`} fill={tag.tagColor} />
        ))}
      </Pie>
    </PieChart>
  );
};
