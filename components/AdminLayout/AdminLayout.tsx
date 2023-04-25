import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Select } from "../UI/Select";
import styles from "../../styles/Admin.module.scss";
import clsx from "clsx";
import { IconButton } from "../UI/IconButton";
import { useRouter } from "next/router";

interface IProps {
  setEdit: Dispatch<SetStateAction<boolean>>;
  setAdd: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

const links = [
  "Инфо",
  "Пользователи",
  "Новости",
  "Категории",
  "Задания",
  "Команды",
];
const pagePathByTitle = {
  "Инфо": "/admin",
  "Пользователи": "/admin/users",
  "Новости": "/admin/news",
  "Категории": "/admin/categories",
  "Команды": "/admin/teams",
  "Задания": "/admin/tasks",
};

const getPageName = (path: string) => {
  const res = Object.entries(pagePathByTitle).find(
    ([key, val]) => path === val
  );
  return res ? res[0] : "";
};

const AdminLayout: FC<IProps> = ({ setAdd, setEdit, children }) => {
  const router = useRouter();
  const pageName = getPageName(router.pathname);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  useEffect(() => {
    if (pageName === "Новости") {
      setShowButtons(true);
    } else if (pageName === "Категории") {
      setShowButtons(true);
    } else if (pageName === "Задания") {
      setShowButtons(true);
    } else {
      setShowButtons(false);
    }
  }, []);

  return (
    <>
      <div className={styles.mobileToolbar}>
        <Select
          type="select"
          active={pageName}
          // @ts-ignore
          setActive={(name) => router.push(pagePathByTitle[name])}
          variant="black"
          showTitle={false}
          title={pageName}
          options={links}
        />
        {showButtons && (
          <div className={styles.mobileButtons}>
            <IconButton
              onClick={() => {
                setAdd((v) => !v);
                setEdit(false);
              }}
              type="add"
            />
          </div>
        )}
      </div>
      <div className={styles.toolbar}>
        <ul>
          <li
            className={clsx({ [styles.active]: pageName === "Инфо" })}
            onClick={() => router.push("/admin/")}
          >
            Инфо
          </li>
          <li
            className={clsx({ [styles.active]: pageName === "Пользователи" })}
            onClick={() => router.push("/admin/users/")}
          >
            Пользователи
          </li>
          <li
            className={clsx({ [styles.active]: pageName === "Команды" })}
            onClick={() => router.push("/admin/teams/")}
          >
            Команды
          </li>
          <li
            className={clsx({ [styles.active]: pageName === "Новости" })}
            onClick={() => router.push("/admin/news")}
          >
            Новости
          </li>
          <li
            className={clsx({ [styles.active]: pageName === "Категории" })}
            onClick={() => router.push("/admin/categories/")}
          >
            Категории
          </li>
          <li
            className={clsx({ [styles.active]: pageName === "Задания" })}
            onClick={() => router.push("/admin/tasks/")}
          >
            Задания
          </li>
        </ul>
        {showButtons && (
          <div className={styles.buttons}>
            <IconButton
              onClick={() => {
                setAdd((v) => !v);
                setEdit(false);
              }}
              type="add"
            />
          </div>
        )}
      </div>
      {children}
    </>
  );
};

export default AdminLayout;
