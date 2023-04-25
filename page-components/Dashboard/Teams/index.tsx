import { TeamCard } from "@/page-components/TeamCard";
import Link from "next/link";
import styles from "./Teams.module.scss";
import { ITeam } from "@/utils/server/teams/getTeam";
import { FC } from "react";
import { Button } from "@/components";
import { useRouter } from "next/router";
import {NoComplete} from "@/page-components/Dashboard/Complete/NoComplete";
import {NoTeam} from "@/page-components/Dashboard/Teams/NoTeam";

interface IProps {
  team: ITeam;
}

export const Teams: FC<IProps> = ({ team }) => {
  const router = useRouter()

  return (
    <div className={styles.teams}>
      {team ? (
        <Link key={team.id} href="/team">
          <TeamCard
            avatar={team.avatar}
            className={styles.card}
            title={team.name}
            teamId={team.id}
          />
        </Link>
      ) : (
        // <div className={styles.notFound}>
        //   <p className={styles.desc}>Вы не состоите в команде:</p>
        //
        //     <Button
        //     onClick={() => router.push("/team?join=true")}
        //       style={{ padding: "0 10px" }}
        //       variant="green"
        //       text="Вступить в команду"
        //     />
        //
        // </div>
        <NoTeam />
      )}
    </div>
  );
};
