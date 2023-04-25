import { withLayout } from "@/layout/Layout";
import styles from "../styles/Notifications.module.scss";

import Icon from "../public/icons/time.svg";
import { FC } from "react";
import getNotifications, {
  INotification,
} from "@/utils/server/get/getNotifications";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";

interface IProps {
  notificationsList: INotification[];
}

const Notifications: FC<IProps> = ({ notificationsList }) => {
  return (
    <>
      <Head>
        <title>Игры Кодебай | Уведомления</title>
      </Head>
      <div className={styles.notifications}>
        {notificationsList?.length ? (
          notificationsList.map(({description, id}) => (
            <div key={id} className={styles.notification}>
              <span>{description}</span>
              <Icon />
            </div>
          ))
        ) : (
          <h1>Нет доступных уведомлений</h1>
        )}
      </div>
    </>
  );
};

export default withLayout(Notifications, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const notifications = await getNotifications({
    limit: 20,
    token: session?.user.token!,
    userId: session?.user.id!,
  });

  return {
    props: {
      notificationsList: notifications,
      session
    },
  };
}
