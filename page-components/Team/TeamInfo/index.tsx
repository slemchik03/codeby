import { Card } from "@/page-components/Card";
import { Complete } from "@/page-components/Dashboard/Complete";
import { Info } from "@/page-components/UserProfile/Info";
import styles from "./Info.module.scss";
import { Progress } from "@/page-components/Dashboard/Progress";
import { Points } from "@/page-components/UserProfile/Points";
import { TopTen } from "@/page-components/Dashboard/TopTen";
import { ITeam } from "@/utils/server/teams/getTeam";
import { FC } from "react";
import { IUser } from "@/utils/server/get/getUser";
import { IScoreboardTeam } from "@/utils/server/teams/getScoreboardTeam";
import { IScoreboardCategories } from "@/utils/server/get/getScoreboardCategories";

interface IProps {
  team: ITeam;
  ownerUser: IUser;
  teamScoreboard: IScoreboardTeam;
  teamCategoriesScoreboard: IScoreboardCategories;
}

export const TeamInfo: FC<IProps> = ({
  team,
  teamScoreboard,
  teamCategoriesScoreboard,
}) => {
  return (
    <div className={styles.teamInfo}>
      <Card title="Прогресс команды" className={styles.progress}>
        <Progress
          scoreboard={{
            points: teamScoreboard.points,
            rating: teamScoreboard.rating,
            place: teamScoreboard.place,
          }}
          team={team}
        />
      </Card>
      <Card title="Описание" className={styles.info}>
        {team?.description}
      </Card>
      <Card title="Выполнено заданий" className={styles.complete}>
        <Complete categoriesScoreboard={teamCategoriesScoreboard} />
      </Card>
      <Card title="Баллы" className={styles.points}>
        <Points categoriesScoreboard={teamCategoriesScoreboard} />
      </Card>
      <Card title="Рейтинг Топ-10 участников команды" className={styles.topTen}>
        <TopTen scoreboardUsers={teamScoreboard.users.slice(0, 10)} />
      </Card>
    </div>
  );
};
