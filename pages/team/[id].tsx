import { withLayout } from "@/layout/Layout";
import { Card, Complete, Progress } from "@/page-components";
import getScoreboard, { IScoreboard } from "@/utils/server/get/getScoreboard";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC } from "react";
import styles from "../../styles/User.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import getUser, { IUser } from "@/utils/server/get/getUser";
import { Info } from "@/page-components/UserProfile/Info";
import { Points } from "@/page-components/UserProfile/Points";
import { Activity } from "@/page-components/UserProfile/Activity";
import getCompletedTasks, { ICompletedTask } from "@/utils/server/get/getCompletedTasks";
import getTeam, { ITeam } from "@/utils/server/teams/getTeam";

interface IProps {
  currentTeamScoreboard: IScoreboard;
  categoriesScoreboard: IScoreboardCategories;
  lastCompletedTasks: ICompletedTask[]
  searchedTeam: ITeam;
}

const User: FC<IProps> = ({
currentTeamScoreboard,
  categoriesScoreboard,
  searchedTeam,
  lastCompletedTasks
}) => {
  const complete = true;

  return (
    <>
      <Head>
        <title>Игры Кодебай | «{searchedTeam.name}»</title>
      </Head>
      <div className={styles.userProfileGrid}>
        <Card title={`Прогресс команды `} className={styles.progress}>
        <Progress
          scoreboard={{
            points: currentTeamScoreboard.points,
            rating: currentTeamScoreboard.rating,
            place: currentTeamScoreboard.place,
          }}
          team={searchedTeam}
        />
        </Card>
        <Card title="Описание" className={styles.info}>
          {searchedTeam?.description}
        </Card>
        <Card
          title="Выполнено заданий"
          className={clsx(styles.complete, { [styles.noComplete]: !complete })}
        >
          <Complete categoriesScoreboard={categoriesScoreboard} />
        </Card>
        <Card title="Баллы команды" className={styles.points}>
          <Points categoriesScoreboard={categoriesScoreboard} />
        </Card>
        <Card title="Активность" className={styles.activity}>
          <Activity lastCompletedTasks={lastCompletedTasks} />
        </Card>
      </div>
    </>
  );
};

export default withLayout(User, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const id = Array.isArray(ctx.query["id"])
    ? ctx.query["id"][0]
    : ctx.query["id"];
  const searchedTeam = await getTeam({ token: session?.user.token!, id });

  if (searchedTeam) {
    const currentTeamScoreboard = await getScoreboard({
      token: session?.user.token!,
      teamId: searchedTeam?.id!,
    });

    const categoriesScoreboard = await getScoreboardCategories({
      token: session?.user.token!,
      teamId: searchedTeam?.id!,
    });

    const lastCompletedTasks = await getCompletedTasks({
      limit: 5,
      teamId: searchedTeam?.id!,
      token: session?.user.token!,
    });

    return {
      props: {
        currentTeamScoreboard,
        categoriesScoreboard,
        lastCompletedTasks,
        searchedTeam,
        session,
      },
    };
  }
  return {
    props: {},
    redirect: {
      destination: "/",
    },
  };
};
