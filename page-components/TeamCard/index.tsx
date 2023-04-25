import clsx from "clsx";
import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import styles from "./TeamCard.module.scss";
import image from "../../public/images/team-image.png";
import Arrow from "../../public/icons/RightArrow.svg";
import { useQuery } from "react-query";
import getScoreboardTeam from "@/utils/server/teams/getScoreboardTeam";
import { useSession } from "next-auth/react";

export interface TeamCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  avatar: string;
  teamId: string;
}

export const TeamCard = ({
  className,
  title,
  avatar,
  teamId,
}: TeamCardProps) => {
  const { data: session } = useSession();
  const { data: teamScoreboard } = useQuery("team-" + teamId, () =>
    getScoreboardTeam({ teamId, token: session?.user.token! })
  );
  return (
    <div className={clsx(styles.teamCard, className)}>
      <div className={styles.left}>
        <Image
          className={styles.image}
          src={
            avatar
              ? `${process.env.apiUrl}/images/${avatar}?${new Date().getTime()}`
              : image
          }
          alt=""
          width={62}
          height={62}
        />
        <div className={styles.text}>
          <p className={styles.title}>{title}</p>
          <p className={styles.count}>
            {teamScoreboard?.users?.length || 1}{" "}
            {Number(teamScoreboard?.users?.length) >= 10
              ? "участников"
              : Number(teamScoreboard?.users?.length) || 1 === 1
              ? "участник"
              : "участника"}
          </p>
        </div>
      </div>
      <Arrow />
    </div>
  );
};
