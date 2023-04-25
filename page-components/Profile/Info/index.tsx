import useUser from "@/hooks/useUser";
import { FC } from "react";
import styles from "./Info.module.scss";

interface IProps {
  type?: "public";
  
}

export const Info: FC<IProps> = ({ type }) => {
  const user = useUser();
  return (
    <div className={styles.info}>
      <span className={styles.about}>{user?.biography}</span>
      <div className={styles.contacts}>
        <p>
          <span>Полное имя:</span> {user?.full_name || ""}
        </p>
        <p>
          <span>GitHub:</span> {user?.github_url || ""}
        </p>
        <p>
          <span>Telegram:</span>{" "}
          {type !== "public"
            ? (user?.telegram_id || "")
            : (user?.telegram_mention || "")}
        </p>
        {type !== "public" && (
          <p>
            <span>Email:</span> {user?.email || ""}
          </p>
        )}
      </div>
    </div>
  );
};

