import { ICompletedTask } from "@/utils/server/get/getCompletedTasks";
import { FC, useMemo } from "react";
import { LineChart, Line, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface IProps {
  lastCompletedTasks: ICompletedTask[];
}

const CustomTooltip = ({ active, payload }: {active: any, payload: any}) => {
  if (active && payload && payload.length) {
    return (
      <p
        style={{
          fontSize: "16px",
          color: "white",
          padding: "0 6px",
          paddingBottom: "8px",
        }}
      >
        <span style={{ color: "#9fef00" }}>{payload[0].payload.value}</span>
      </p>
    );
  }

  return null;
};

export const Chart: FC<IProps> = ({ lastCompletedTasks }) => {
  const data = useMemo(
    () =>
      lastCompletedTasks?.map(({ points }) => ({
        value: points,
        name: "",
      })),
    [lastCompletedTasks]
  );

  return (
    <ResponsiveContainer width="98%" height={450}>
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <YAxis />
        <Tooltip
          itemStyle={{ fontSize: "16px" }}
          labelStyle={{ display: "none" }}
          wrapperStyle={{
            outline: "none",
            background: "#282c35",
            borderRadius: "7px",
            paddingTop: "7px",
          }}
          contentStyle={{
            backgroundColor: "none",
            background: "none",
            border: 0,
          }}
          cursor={{ fill: "transparent" }}
        />
        <Line type="monotone" dataKey="value" stroke="#9fef00" />
      </LineChart>
    </ResponsiveContainer>
  );
};
