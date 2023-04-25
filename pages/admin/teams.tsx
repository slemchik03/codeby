import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { withLayout } from "@/layout/Layout";
import { Card } from "@/page-components/Card";
import getUser from "@/utils/server/get/getUser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC, useState } from "react";
import styles from "../../styles/Admin.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import getTeams from "@/utils/server/teams/getTeams";
import { TeamsList } from "@/page-components/Admin/TeamsList";
import { ITeam } from "@/utils/server/teams/getTeam";
import { SearchTeamFields } from "@/page-components/Admin/SearchTeamFields";

interface IProps {
  teamsList: ITeam[];
}

const Users: FC<IProps> = ({ teamsList }) => {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Игры Кодебай | Команды</title>
      </Head>
      <div className={styles.admin}>
        <AdminLayout setAdd={setAdd} setEdit={setEdit}>
          <div style={{ marginBottom: "30px" }}>
            <SearchTeamFields />
          </div>
          <Card title="Список команд">
            <TeamsList teamList={teamsList} />
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
    const teamsList = await getTeams({
      limit: 100,
      title: query
        ? Array.isArray(query["title"])
          ? query["title"][0]
          : query["title"]
        : "",
      token: session?.user.token!,
    });

    return {
      props: { teamsList: teamsList || [], session },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
