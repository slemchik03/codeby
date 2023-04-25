import { Button } from "@/components";
import styles from "./NoTeam.module.scss";
import { JoinTeam } from "@/components/Modal/JoinTeam";
import { FC, useState } from "react";
import { CreateTeam } from "@/components/Modal/CreateTeam";
import { ITeam } from "@/utils/server/teams/getTeam";
import { useRouter } from "next/router";

interface IProps {
  teamsList: ITeam[]
}

export const NoTeam: FC<IProps> = ({teamsList}) => {
  const router = useRouter()
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(!!router.query["join"]);
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  
  return (
    <div className={styles.noTeam}>
      <JoinTeam
      teamsList={teamsList}
        isOpen={isJoinTeamOpen}
        onClose={() => setIsJoinTeamOpen(false)}
        onSuccess={() => {}}
      />
      <CreateTeam
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
      />
      <p className={styles.title}>Вы не состоите в команде</p>
      <p className={styles.desc}>
        Создайте свою команду и пригласите в нее своих друзей или вступите по
        приглашению
      </p>
      <div className={styles.buttons}>
        <Button onClick={() => setIsCreateTeamOpen(true)} text="Создать команду" variant="green" />
        <Button onClick={() => setIsJoinTeamOpen(true)} text="Вступить в команду" variant="white" />
      </div>
    </div>
  );
};
