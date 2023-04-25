import { FC } from "react";
import styles from "./Info.module.scss";
import { IUser } from "@/utils/server/get/getUser";

interface IProps {
  type?: "public";
  user: IUser | null
}

export const Info: FC<IProps> = ({ type, user }) => {
  return (
    <div className={styles.info}>
      <span className={styles.about}>{user?.biography}</span>
      <div className={styles.contacts}>
        <p>
          <span>Полное имя:</span> {user?.full_name || "отсутствует"}
        </p>
        <p>
          <span>GitHub:</span> {user?.github_url || "отсутствует"}
        </p>
        <p>
          <span>Telegram:</span>{" "}
          {type !== "public"
            ? (user?.telegram_id || "отсутствует")
            : (user?.telegram_mention || "отсутствует")}
        </p>
        {type !== "public" && (
          <p>
            <span>Email:</span> {user?.email || "отсутствует"}
          </p>
        )}
      </div>
    </div>
  );
};