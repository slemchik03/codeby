import clsx from "clsx";
import { FC, useState } from "react";
import { withLayout } from "@/layout/Layout";
import { Button, IconButton, Select } from "@/components";
import styles from "../../styles/Team.module.scss";
import { NoTeam } from "@/page-components/Team/NoTeam";
import { TeamInfo } from "@/page-components/Team/TeamInfo";
import { Participants } from "@/page-components/Team/Participants";
import { Settings } from "@/page-components/Team/Settings";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import getTeam, { ITeam } from "@/utils/server/teams/getTeam";
import getTeams from "@/utils/server/teams/getTeams";
import getUser, { IUser } from "@/utils/server/get/getUser";
import getScoreboardTeam, {
  IScoreboardTeam,
} from "@/utils/server/teams/getScoreboardTeam";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import leaveFromTeam from "@/utils/server/teams/leaveFromTeam";
import { useSession } from "next-auth/react";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/router";
import createErrorMessage from "@/utils/createErrorMessage";
import { ConfirmAct } from "@/components/Modal/ConfirmAct";
import Head from "next/head";

interface IProps {
  teamsList: ITeam[];
  ownerUser?: IUser;
  teamScoreboard?: IScoreboardTeam;
  team?: ITeam;
  isOwner?: boolean;
  teamCategoriesScoreboard?: IScoreboardCategories;
}

const Team: FC<IProps> = ({
  teamsList,
  team,
  isOwner,
  ownerUser,
  teamScoreboard,
  teamCategoriesScoreboard,
}) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [page, setPage] = useState<string>("Инфо");
  const [isConfirmActModalOpen, setConfirmActModalOpen] = useState(false);

  const leaveFromTeamHanlder = async () => {
    const response = await leaveFromTeam({ token: session?.user.token! });

    if (response?.status) {
      toast.success("Вы успешно покинули команду!");
      return router.push("/team");
    }
    toast.error(createErrorMessage(response?.errors));
  };
  return (
    <>
      <Head>
        <title>Игры Кодебай | Команда</title>
      </Head>
      <div className={styles.team}>
        {!team ? (
          <NoTeam teamsList={teamsList} />
        ) : (
          <>
            <ConfirmAct
              isOpen={isConfirmActModalOpen}
              title="Вы уверены, что хотите выйти из команды?"
              successBtnText="Выйти"
              closeBtnText="Отмена"
              onSuccess={leaveFromTeamHanlder}
              onClose={() => setConfirmActModalOpen(false)}
            />
            <Toaster
              toastOptions={{
                style: {
                  background: "#282c35",
                  color: "#ffff",
                },
              }}
            />
            <div className={styles.mobileToolbar}>
              <Select
                type="select"
                active={page}
                setActive={setPage}
                variant="black"
                showTitle={false}
                title={page}
                options={
                  isOwner
                    ? ["Инфо", "Участники", "Настройки"]
                    : ["Инфо", "Участники"]
                }
              />

              <div className={styles.mobileButtons}>
                {page === "Инфо" && (
                  <>
                    <IconButton
                      onClick={() => setConfirmActModalOpen(true)}
                      type="delete"
                    />
                  </>
                )}
              </div>
            </div>
            <div className={styles.toolbar}>
              <ul>
                <li
                  className={clsx({ [styles.active]: page === "Инфо" })}
                  onClick={() => setPage("Инфо")}
                >
                  Инфо
                </li>
                <li
                  className={clsx({ [styles.active]: page === "Участники" })}
                  onClick={() => setPage("Участники")}
                >
                  Участники
                </li>
                {isOwner && (
                  <li
                    className={clsx({ [styles.active]: page === "Настройки" })}
                    onClick={() => setPage("Настройки")}
                  >
                    Настройки
                  </li>
                )}
              </ul>
              <div className={styles.buttons}>
                {page === "Инфо" && (
                  <>
                    <IconButton
                      onClick={() => setConfirmActModalOpen(true)}
                      type="delete"
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
        {team && page === "Инфо" && (
          <TeamInfo
            teamCategoriesScoreboard={teamCategoriesScoreboard!}
            ownerUser={ownerUser!}
            team={team}
            teamScoreboard={teamScoreboard!}
          />
        )}
        {team && page === "Участники" && (
          <Participants
            teamId={team?.id}
            ownerUser={ownerUser!}
            users={
              Array.isArray(teamScoreboard?.users || teamScoreboard?.users)
                ? teamScoreboard?.users!
                // @ts-ignore
                : ([teamScoreboard?.users] as IScoreboardTeam["users"])
            }
          />
        )}
        {team && isOwner && page === "Настройки" && <Settings team={team} />}
      </div>
    </>
  );
};

export default withLayout(Team, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    id: session?.user.id!,
    token: session?.user.token!,
  });
  const teamsList = await getTeams({ token: session?.user.token!, limit: 100 });
  if (user?.team_id !== "00000000-0000-0000-0000-000000000000" && user) {
    const teamInfo = await getTeam({
      id: user.team_id,
      token: session?.user.token!,
    });
    const ownerUser = await getUser({
      id: teamInfo?.owner_id,
      token: session?.user.token!,
    });
    const teamScoreboard = await getScoreboardTeam({
      teamId: teamInfo?.id!,
      token: session?.user.token!,
    });
    const teamCategoriesScoreboard = await getScoreboardCategories({
      teamId: teamInfo?.id!,
      token: session?.user.token!,
    });

    return {
      props: {
        team: teamInfo,
        teamCategoriesScoreboard,
        ownerUser,
        isOwner: teamInfo?.owner_id === user.id,
        teamScoreboard,
        teamsList: teamsList || [],
        session,
      },
    };
  }
  
  return {
    props: {
      teamsList: teamsList || [],
      session,
    },
  };
};
