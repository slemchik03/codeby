import clsx from "clsx";
import { useState } from "react";
import { Edit } from "./Edit";
import { SettingsMobilePage, SettingsPage } from "@/types/settings";
import styles from "./Settings.module.scss";
import { Button } from "@/components";
import Arrow from "../../public/icons/RightArrow.svg";
import useWindowSize from "@/hooks/useWindowSize";
import { Safety } from "./Safety";
import { selectSetting } from "@/redux/settings/selector";
import { useSelector } from "react-redux";
import updateUser from "@/utils/server/update/updateUser";
import { signOut, useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import deleteUser from "@/utils/server/delete/deleteUser";
import { useRouter } from "next/router";
import createErrorMessage from "@/utils/createErrorMessage";
import { DeleteUser } from "@/components/Modal/DeleteUser";
import useUser from "@/hooks/useUser";

export const Settings = () => {
  const [page, setPage] = useState<SettingsPage>("edit");
  const [mobilePage, setMobilePage] = useState<SettingsMobilePage>("none");
  const [isDeleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const user = useUser()
  const router = useRouter();
  const {
    full_name,
    telegram_mention,
    login,
    github_url,
    biography,
    email,
    password,
  } = useSelector(selectSetting);
  const { data: session } = useSession();
  
  const windowSize = useWindowSize();
  if (!windowSize) {
    return null;
  }

  const deleteAccount = async () => {
    const response = await deleteUser({
      token: session?.user.token!,
      userId: session?.user.id!,
    });
    if (response?.status) {
      toast.success("Вы успешно удалили аккаунт!");
      setDeleteUserModalOpen(false);
      return signOut();
    }
    toast.error("Не удалось удалить аккаунт!");
  };

  const submitBtnClickHandler = async () => {
    if (page === "edit") {
      const toastId = toast.loading("Обновляем настройки профиля...");
      const updateUserRes = await updateUser(
        {
          full_name,
          telegram_mention,
          biography,
          github_url,
          login,
        },
        session?.user.token!
      );

      toast.dismiss(toastId);
      if (updateUserRes?.status) {
        toast.success("Настройки успешно обновлены!");
        return router.replace("/");
      } else {
        toast.error(
          createErrorMessage(
            updateUserRes?.errors,
            "Не удалось обновить настройки!"
          )
        );
      }
    } else {
      const toastId = toast.loading("Обновляем настройки безопасности...");
      const res = await updateUser(
        {
          email,
          password,
        },
        session?.user.token!
      );
      toast.dismiss(toastId);
      if (res?.status) {
        toast.success("Настройки успешно обновлены!");
        return router.replace("/");
      } else {
        toast.error(
          createErrorMessage(res?.errors, "Не удалось обновить настройки!")
        );
      }
    }
  };

  return (
    <div className={styles.settings}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <DeleteUser
        successBtnText="Удалить"
        closeBtnText="Закрыть"
        title="Введите логин"
        isOpen={isDeleteUserModalOpen}
        userLogin={user?.login!}
        onClose={() => setDeleteUserModalOpen(false)}
        onSuccess={deleteAccount}
      />
      <div className={styles.links}>
        <ul>
          <li
            className={clsx({ [styles.active]: page === "edit" })}
            onClick={() => setPage("edit")}
          >
            Редактировать профиль
          </li>
          <li
            className={clsx({ [styles.active]: page === "safety" })}
            onClick={() => setPage("safety")}
          >
            Безопасность
          </li>
        </ul>
      </div>
      {mobilePage === "none" && (
        <div className={styles.mobileLinks}>
          <ul>
            <li
              className={clsx({ [styles.active]: page === "edit" })}
              onClick={() => setMobilePage("mobileEdit")}
            >
              <span>Редактировать профиль</span>
              <Arrow />
            </li>
            <li
              className={clsx({ [styles.active]: page === "safety" })}
              onClick={() => setMobilePage("mobileSafety")}
            >
              <span>Безопасность</span>
              <Arrow />
            </li>
            <li
              className={clsx({ [styles.active]: page === "notifications" })}
              onClick={() => setMobilePage("mobileNotifications")}
            >
              <span>Уведомления</span>
              <Arrow />
            </li>
          </ul>
        </div>
      )}
      {page === "edit" && windowSize > 720 && <Edit />}
      {page === "safety" && windowSize > 720 && <Safety />}
      {mobilePage === "mobileEdit" && <Edit />}
      {mobilePage === "mobileSafety" && <Safety />}
      {windowSize < 720 && mobilePage === "none" ? null : (
        <div className={styles.buttons}>
          <Button
            onClick={submitBtnClickHandler}
            className={styles.save}
            text="Сохранить изменения"
            variant="green"
          />
          <button
            onClick={() => setDeleteUserModalOpen(true)}
            className={styles.delete}
          >
            Удалить аккаунт
          </button>
        </div>
      )}
    </div>
  );
};
