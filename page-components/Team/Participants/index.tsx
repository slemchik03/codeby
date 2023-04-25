import { ParticipantCard } from "@/page-components/ParticipantCard";
import styles from "./Participants.module.scss";
import { IUser } from "@/utils/server/get/getUser";
import { FC, useState } from "react";
import useUser from "@/hooks/useUser";
import { ConfirmAct } from "@/components/Modal/ConfirmAct";
import updateTeam from "@/utils/server/teams/updateTeam";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import createErrorMessage from "@/utils/createErrorMessage";

interface IProps {
  users: {
    points: number;
    updated_at: string;
    user: IUser;
  }[];
  ownerUser: IUser;
  teamId: string;
}
let userToUpdate: IUser | null = null;

export const Participants: FC<IProps> = ({ users, ownerUser, teamId }) => {
  const currentUser = useUser();
  const { data: session } = useSession();
  const router = useRouter()
  const [isConfirmActModalOpen, setConfirmActModalOpen] = useState(false);

  const makeLeaderHandler = async (id: string) => {

    if (currentUser?.id === ownerUser.id) {
      const response = await updateTeam({
        token: session?.user.token!,
        teamId: teamId,
        credentials: { owner_id: id },
      });
      if (response?.status) {
        setConfirmActModalOpen(false)
        toast.success(`${userToUpdate?.login} новый лидер!`)
        return router.replace("/team")
      }
      toast.error(createErrorMessage(response?.errors))
    }
  };
  return (
    <div className={styles.participants}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <ConfirmAct
        isOpen={isConfirmActModalOpen}
        onClose={() => setConfirmActModalOpen(false)}
        onSuccess={() => makeLeaderHandler(userToUpdate?.id!)}
        title={`Вы уверены, что хотите назначить ${userToUpdate?.login} новым лидером?`}
        closeBtnText="Отменить"
        successBtnText="Подтвердить"
      />
      {users.map(({ user }) => (
        <ParticipantCard
          key={user.id}
          showRole
          // @ts-ignore
          role={user.role}
          isOwner={ownerUser.id === user?.id}
          ownerUser={ownerUser}
          user={user}
          makeLeaderHandler={() => {
            userToUpdate = user;
            setConfirmActModalOpen(true);
          }}
        />
      ))}
    </div>
  );
};
