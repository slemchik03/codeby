import { IScoreboardList } from "@/utils/server/get/getScoreboardList";
import { FC } from "react";
import { Chart } from "./Chart";
import styles from "./TopTen.module.scss";
import { IScoreboardTeam } from "@/utils/server/teams/getScoreboardTeam";

interface IProps {
  scoreboardTeams?: IScoreboardList[];
  scoreboardUsers?: IScoreboardTeam["users"];
}

export const TopTen: FC<IProps> = ({ scoreboardTeams, scoreboardUsers }) => {
  return (
    <div className={styles.topTen}>
      <Chart
        scoreboardTeams={scoreboardTeams || undefined}
        scoreboardUsers={scoreboardUsers || undefined}
      />
      <p>
        *Здесь находятся только лучшие. Выполняй таски, зарабатывай очки и
        попадай в топ, если тебя здесь ещё нет.
      </p>
    </div>
  );
};
