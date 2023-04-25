import clsx from "clsx";
import { withLayout } from "@/layout/Layout";
import {
  Activity,
  Card,
  Complete,
  Info,
  Points,
  Progress,
} from "@/page-components";
import styles from "../styles/Profile.module.scss";
import getScoreboard, { IScoreboard } from "@/utils/server/get/getScoreboard";
import { FC } from "react";
import { getServerSession } from "next-auth/next";
import { GetServerSideProps } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import getCompletedTasks, {
  ICompletedTask,
} from "@/utils/server/get/getCompletedTasks";
import Head from "next/head";
import getUser, { IUser } from "@/utils/server/get/getUser";
import getTeam, { ITeam } from "@/utils/server/teams/getTeam";

interface IProps {
  team: ITeam;
  currentUserScoreboard: IScoreboard;
  categoriesScoreboard: IScoreboardCategories;
  lastCompletedTasks: ICompletedTask[];
  user: IUser;
}

const Profile: FC<IProps> = ({
  team,
  user,
  currentUserScoreboard,
  categoriesScoreboard,
  lastCompletedTasks,
}) => {
  const complete = true;

  return (
    <>
      <Head>
        <title>Игры Кодебай | Профиль</title>
      </Head>
      <div className={styles.profile}>
        <Card title="Мой прогресс" className={styles.progress}>
          <Progress
            team={{ ...team, avatar: user.avatar, name: user?.login }}
            scoreboard={currentUserScoreboard}
          />
        </Card>
        <Card title="Информация" className={styles.info}>
          <Info />
        </Card>
        <Card
          title="Выполнено заданий"
          className={clsx(styles.complete, { [styles.noComplete]: !complete })}
        >
          <Complete categoriesScoreboard={categoriesScoreboard} />
        </Card>
        <Card title="Мои баллы" className={styles.points}>
          <Points categoriesScoreboard={categoriesScoreboard} />
        </Card>
        <Card title="Активность" className={styles.activity}>
          <Activity lastCompletedTasks={lastCompletedTasks} />
        </Card>
      </div>
    </>
  );
};

export default withLayout(Profile, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    token: session?.user.token!,
    id: session?.user.id,
  });
  const team = await getTeam({
    token: session?.user.token!,
    id: user?.team_id,
  });

  const currentUserScoreboard = await getScoreboard({
    token: session?.user.token!,
    teamId: team?.id!,
  });

  const categoriesScoreboard = await getScoreboardCategories({
    token: session?.user.token!,
    teamId: user?.team_id!,
  });
  const lastCompletedTasks = await getCompletedTasks({
    limit: 5,
    teamId: user?.team_id!,
    userId: session?.user.id!,
    token: session?.user.token!,
  });
  const isRightTeam = team?.id === user?.team_id;
  return {
    props: {
      currentUserScoreboard: isRightTeam ? currentUserScoreboard : null,
      session,
      categoriesScoreboard: isRightTeam
        ? categoriesScoreboard
        : { categories: [] },
      lastCompletedTasks: isRightTeam ? lastCompletedTasks : [],
      team: isRightTeam ? team : null,
      user,
    },
  };
};
