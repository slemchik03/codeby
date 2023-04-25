import { withLayout } from "@/layout/Layout";
import { NewsCard } from "@/page-components";
import getNews, { INews } from "@/utils/server/get/getNews";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC } from "react";
import styles from "../styles/News.module.scss";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";

interface IProps {
  newsList: INews[];
}

const News: FC<IProps> = ({ newsList }) => {
  return (
    <>
      <Head>
        <title>Игры Кодебай | Новости</title>
      </Head>
      <div className={styles.news}>
        {newsList?.length ? (
          newsList.map(({ created_at, title, description, id }) => (
            <>
              {/* @ts-ignore does not matter */}
              <NewsCard
                key={id}
                description={description}
                title={title}
                created_at={created_at}
                color="black"
                className={styles.card}
              />
            </>
          ))
        ) : (
          <h1>Новостей ещё нет</h1>
        )}
      </div>
    </>
  );
};

export default withLayout(News, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const news = await getNews({ limit: 20, token: session?.user.token! });

  return {
    props: {
      newsList: news,
      session
    },
  };
}
