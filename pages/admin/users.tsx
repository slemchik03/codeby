import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { withLayout } from "@/layout/Layout";
import { UsersList } from "@/page-components/Admin/UsersList";
import { Card } from "@/page-components/Card";
import getUser, { IUser } from "@/utils/server/get/getUser";
import getUsersList from "@/utils/server/get/getUsersList";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC, useState } from "react";
import styles from "../../styles/Admin.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import { SearchUserFields } from "@/page-components/Admin/SearchUserFields";

interface IProps {
  usersList: IUser[];
}

const Users: FC<IProps> = ({ usersList }) => {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Игры Кодебай | Пользователи</title>
      </Head>
      <div className={styles.admin}>
        <AdminLayout setAdd={setAdd} setEdit={setEdit}>
          <div style={{ marginBottom: "30px" }}>
            <SearchUserFields />
          </div>
          <Card title="Список пользователей">
            <UsersList usersList={usersList} />
          </Card>
        </AdminLayout>
      </div>
    </>
  );
};

export default withLayout(Users, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    id: session?.user.id!,
    token: session?.user.token!,
  });
  const { query } = ctx;

  if (user?.role === "администратор") {
    const usersList = await getUsersList({
      limit: 100,
      login: query
        ? Array.isArray(query["login"])
          ? query["login"][0]
          : query["login"]
        : "",
      id: query
        ? Array.isArray(query["id"])
          ? query["id"][0]?.trim()
          : query["id"]?.trim()
        : "",
      token: session?.user.token!,
    });

    return {
      props: { usersList: usersList || [], session },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
