import Image from "next/image";
import styles from "./Progress.module.scss";
import ScoreIcon from "../../../public/icons/Score.svg";
import RatingIcon from "../../../public/icons/Rating.svg";
import { ProgressBar } from "@/components";
import { FC } from "react";
import { IScoreboard } from "@/utils/server/get/getScoreboard";
import dayjs from "dayjs";
import { ITeam } from "@/utils/server/teams/getTeam";

interface IProps {
  scoreboard: IScoreboard,
  team: ITeam
}

export const Progress: FC<IProps> = ({scoreboard, team}) => {
  const registerDate = dayjs(team?.created_at)
 
  return (
    <div className={styles.progress}>
      <div className={styles.top}>
        <Image
          className={styles.image}
          src={
            team?.avatar
              ? `${process.env.apiUrl}/images/${team?.avatar}?${new Date().getTime()}`
              : "/icons/upload.svg"
          }
          alt=""
          height={92}
          width={92}
        />
        <div className={styles.info}>
          <span>{team?.name}</span>
          <p>{dayjs(new Date).diff(registerDate, "days") + 1} дней с Codeby.Games</p>
        </div>
      </div>
      <div className={styles.data}>
        <div className={styles.item}>
          <ScoreIcon />
          <div className={styles.itemData}>
            <div>
              <span>Заработано баллов</span>
              <span>{scoreboard?.points}</span>
            </div>
            <ProgressBar progress={`${scoreboard?.points / (10000 / 100)}`} />
          </div>
        </div>
        <div className={styles.item}>
          <RatingIcon />
          <div className={styles.itemData}>
            <div>
              <span>Рейтинг</span>
              <span>{scoreboard?.place}</span>
            </div>
            <ProgressBar progress={`${scoreboard?.rating?.toFixed(2)}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
