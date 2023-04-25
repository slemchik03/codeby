import { withLayout } from "@/layout/Layout";
import {
  Card,
  Complete,
  News,
  Progress,
  TopFifty,
  TopTen,
} from "@/page-components";
import getNews, { INews } from "@/utils/server/get/getNews";
import getScoreboard, { IScoreboard } from "@/utils/server/get/getScoreboard";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import getScoreboardList, {
  IScoreboardList,
} from "@/utils/server/get/getScoreboardList";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC } from "react";
import styles from "../styles/Home.module.scss";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import getUser, { IUser } from "@/utils/server/get/getUser";
import { Teams } from "@/page-components/Dashboard/Teams";
import getTeam, { ITeam } from "@/utils/server/teams/getTeam";
import getScoreboardTeam, { IScoreboardTeam } from "@/utils/server/teams/getScoreboardTeam";


interface IProps {
  news: INews[];
  team: ITeam
  user: IUser;
  topScoreboardList: IScoreboardList[];
  currentUserScoreboard: IScoreboardTeam;
  categoriesScoreboard: IScoreboardCategories;
}

const Home: FC<IProps> = ({
  news,
  user,
  topScoreboardList,
  currentUserScoreboard,
  categoriesScoreboard,
team
}) => {
  const complete = true;

  return (
    <>
      <Head>
        <title>Игры Кодебай | Скорборд</title>
      </Head>
      <div className={styles.homeGrid}>
        <Card title="Прогресс" className={styles.progress}>
          <Progress team={{...team, name: user?.login, avatar: user?.avatar}} scoreboard={currentUserScoreboard} />
        </Card>
        <Card title="Последние новости" className={styles.news}>
          <News newsList={news} />
          {/*<div className={styles.accent_organisation}>*/}
          {/*  <p>Организация и проведение CTF под ключ: <a href="mailto:ctf@codeby.email" target="_blank">ctf@codeby.email</a></p>*/}
          {/*</div>*/}
        </Card>
        <Card title="Команда" className={styles.teams}>
          <Teams team={team} />
        </Card>
        <Card title="Рейтинг Топ-10 команд" className={styles.top10}>
          <TopTen scoreboardTeams={topScoreboardList?.slice(0, 10)} />
        </Card>
        <Card title="Рейтинг Топ-50 команд" className={styles.top50}>
          <TopFifty scoreboard={topScoreboardList} />
        </Card>
        <Card
          title="Выполнено заданий"
          className={clsx(styles.complete, { [styles.noComplete]: !complete })}
        >
          <Complete categoriesScoreboard={categoriesScoreboard} />
        </Card>
      </div>
    </>
  );
};

export default withLayout(Home, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const news = await getNews({ limit: 2, token: session?.user.token! });
  const user = await getUser({
    token: session?.user.token!,
    id: session?.user.id,
  });

  const topScoreboardList = await getScoreboardList({
    limit: 50,
    offset: 0,
    token: session?.user.token!,
  });
  
  const currentUserScoreboard = await getScoreboardTeam({
    token: session?.user.token!,
    teamId: user?.team_id!,
  });

  const categoriesScoreboard = await getScoreboardCategories({
    token: session?.user.token!,
    teamId: user?.team_id!,
  });

  const team = await getTeam({
    id: user?.team_id,
    token: session?.user.token!
  })

  return {
    props: {
      news: news || [],
      team: team?.id === user?.team_id ? team : null,
      topScoreboardList,
      currentUserScoreboard,
      categoriesScoreboard: team?.id === user?.team_id ? categoriesScoreboard : [],
      session,
      user,
    },
  };
};
