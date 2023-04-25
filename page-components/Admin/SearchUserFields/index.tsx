import { Button, Input } from "@/components";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import styles from "./SearchUserFields.module.scss";
import { Card } from "@/page-components/Card";

export const SearchUserFields: FC = () => {
  const [login, setLogin] = useState("");
  const [id, setId] = useState("");
  const router = useRouter();
  return (
    <Card title={"Поиск пользователя"}>
      <div className={styles.searchUserContainer}>
        <div className={styles.inputs}>
          <Input
            onChange={(e) => setLogin(e.currentTarget.value)}
            value={login}
            status={"default"}
            type="text"
            title={"Логин"}
            placeholder={"Введите логин"}
          />
          <Input
            onChange={(e) => setId(e.currentTarget.value)}
            value={id}
            status={"default"}
            type="text"
            title={"ID"}
            placeholder={"Введите ID"}
          />
        </div>
        <Button
          onClick={() => router.push(`/admin/users?login=${login}&id=${id}`)}
          style={{ maxWidth: "212px" }}
          text="Поиск"
          variant="green"
        />
      </div>
    </Card>
  );
};
