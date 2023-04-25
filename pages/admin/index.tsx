import { FC, useState } from "react";
import { withLayout } from "@/layout/Layout";
import { AdminInfo } from "@/page-components";
import getUser from "@/utils/server/get/getUser";
import styles from "../../styles/Admin.module.scss";
import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Head from "next/head";
import getStatisticTasks, {
  IStatisticTasks,
} from "@/utils/server/get/getStatisticTasks";
import getStatisticUsers, {
  IStatisticUsers,
} from "@/utils/server/get/getStatisticUsers";
import getStatisticCompletedTasks, {
  IStatisticCompletedTasks,
} from "@/utils/server/get/getStatisticCompletedTasks";
import getStatisticCategories, {
  IStatisticCategories,
} from "@/utils/server/get/getStatisticCategories";

interface IProps {
  statisticTasks: IStatisticTasks;
  statisticUsers: IStatisticUsers;
  statisticCompletedTasks: IStatisticCompletedTasks;
  statisticCategories: IStatisticCategories;
}

const Admin: FC<IProps> = (props) => {
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Head>
        <title>Игры Кодебай | Панель администратора</title>
      </Head>
      <div className={styles.admin}>
        <AdminLayout setAdd={setAdd} setEdit={setEdit}>
          <AdminInfo {...props}/>
        </AdminLayout>
      </div>
    </>
  );
};

export default withLayout(Admin, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  const user = await getUser({
    id: session?.user.id!,
    token: session?.user.token!,
  });
  const statisticTasks = await getStatisticTasks({
    token: session?.user.token!,
  });
  const statisticUsers = await getStatisticUsers({
    token: session?.user.token!,
  });
  const statisticCompletedTasks = await getStatisticCompletedTasks({
    token: session?.user.token!,
  });
  const statisticCategories = await getStatisticCategories({
    token: session?.user.token!,
  });

  if (user?.role === "администратор") {
    return {
      props: {
        session,
        statisticTasks,
        statisticUsers,
        statisticCompletedTasks,
        statisticCategories,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
