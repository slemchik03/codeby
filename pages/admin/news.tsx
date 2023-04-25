import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { withLayout } from "@/layout/Layout";
import { AddNews, AddTask, AdminNews, AdminTasks } from "@/page-components";
import getNews, { INews } from "@/utils/server/get/getNews";
import getUser from "@/utils/server/get/getUser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { getSession } from "next-auth/react";
import { FC, useState } from "react";
import styles from "../../styles/Admin.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";

interface IProps {
  news: INews[];
}

const News: FC<IProps> = ({ news }) => {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Игры Кодебай | Новости</title>
      </Head>
      <div className={styles.admin}>
        <AdminLayout setAdd={setAdd} setEdit={setEdit}>
          {add ? (
            <AddNews  type="add" setAdd={setAdd} />
          ) : edit ? (
            <AddNews type="edit" setEdit={setEdit} />
          ) : (
            <AdminNews setEdit={setEdit} news={news} />
          )}
        </AdminLayout>
      </div>
    </>
  );
};

export default withLayout(News, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    id: session?.user.id!,
    token: session?.user.token!,
  });

  if (user?.role === "администратор") {
    const news = await getNews({ limit: 30, token: session?.user.token! });
    return {
      props: {
        news: news || [],
        session
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
