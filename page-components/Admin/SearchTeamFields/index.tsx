import { Button, Input } from "@/components";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import styles from "./SearchTeamFields.module.scss";
import { Card } from "@/page-components/Card";

export const SearchTeamFields: FC = () => {
  const [title, setTitle] = useState("");
  const router = useRouter();
  return (
    <Card title={"Поиск команды"}>
      <div className={styles.searchUserContainer}>
        <div className={styles.inputs}>
          <Input
            onChange={(e) => setTitle(e.currentTarget.value)}
            value={title}
            status={"default"}
            type="text"
            title={"Название"}
            placeholder={"Введите название"}
          />
        </div>
        <Button
          onClick={() => router.push(`/admin/teams?title=${title}`)}
          style={{ maxWidth: "212px" }}
          text="Поиск"
          variant="green"
        />
      </div>
    </Card>
  );
};
