import { IScoreboardList } from "@/utils/server/get/getScoreboardList";
import { IScoreboardTeam } from "@/utils/server/teams/getScoreboardTeam";
import { FC, useMemo } from "react";
import { BarChart, Bar, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface IProps {
  scoreboardTeams?: IScoreboardList[];
  scoreboardUsers?: IScoreboardTeam["users"];
}
// @ts-ignore
export const CustomTooltip = ({ active, payload }) => {
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
        {payload[0].payload.name}:{" "}
        <span style={{ color: "#9fef00" }}>{payload[0].payload.value}</span>
      </p>
    );
  }

  return null;
};

export const Chart: FC<IProps> = ({ scoreboardUsers, scoreboardTeams }) => {
  const data = useMemo(() => {
    if (scoreboardTeams) {
      const scoreboardData = scoreboardTeams.map(({ team, points }) => ({
        name: team.name,
        value: points,
      }));
      scoreboardData.length = 10;
      return Array.from(
        scoreboardData,
        (val) => val || { name: null, value: null }
      );
    }
    const scoreboardData =
      scoreboardUsers?.map(({ user, points }) => ({
        name: user.login,
        value: points,
      })) || [];
    scoreboardData.length = 10;
    return Array.from(
      scoreboardData,
      (val) => val || { name: null, value: null }
    );
  }, [scoreboardUsers, scoreboardTeams]);

  return (
    <ResponsiveContainer width="100%" height="70%">
      <BarChart
        width={300}
        height={200}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        barSize={16}
      >
        <YAxis />
        <Tooltip
          // @ts-ignore
          content={<CustomTooltip />}
          itemStyle={{ fontSize: "16px" }}
          labelStyle={{ display: "none" }}
          wrapperStyle={{
            outline: "none",
            background: "#282c35",
            borderRadius: "7px",
          }}
          contentStyle={{
            backgroundColor: "none",
            background: "none",
            border: 0,
          }}
          cursor={{ fill: "transparent" }}
        />

        <Bar dataKey="value" fill="#9fef00" />
      </BarChart>
    </ResponsiveContainer>
  );
};
