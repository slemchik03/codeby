import {
  ChangeEventHandler,
  FC,
  FormEventHandler,
  memo,
  useCallback,
  useRef,
  useState,
} from "react";
import styles from "./Settings.module.scss";
import { Button, Input } from "@/components";
import Image from "next/image";
import { EditAvatar } from "@/components/Modal/EditAvatar";
import useUploadImage from "@/hooks/useUploadImage";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { ITeam } from "@/utils/server/teams/getTeam";
import updateTeamImage from "@/utils/server/teams/updateTeamImage";
import updateTeam from "@/utils/server/teams/updateTeam";
import { useRouter } from "next/router";
import createErrorMessage from "@/utils/createErrorMessage";
import { DeleteUser } from "@/components/Modal/DeleteUser";
import deleteTeam from "@/utils/server/teams/deleteTeam";

interface IProps {
  team: ITeam;
}

export const Settings: FC<IProps> = memo(({ team }) => {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamPassword, setPassword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { fileDataURL, changeHandler } = useUploadImage();
  const { data: session } = useSession();
  const [isAvatarEditModalOpen, setAvatarEditModalOpen] = useState(false);
  const [isDeleteTeamModalOpen, setDeleteTeamModalOpen] = useState(false);
  const router = useRouter();
  const handleSaveImage = async (dataUrl?: any) => {
    if (dataUrl) {
      const toastId = toast.loading("Обновляем аватар команды...");
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      const file = new File([blob], "avatar.png", { type: blob.type });

      const response = await updateTeamImage({
        teamId: team?.id,
        file: file!,
        token: session?.user.token!,
      });

      toast.dismiss(toastId);
      if (response?.status) {
        toast.success("Аватар команды успешно обновлён!");
        return setAvatarEditModalOpen(false);
      }
      toast.error(
        createErrorMessage(
          response?.errors,
          "Не удалось обновить аватар команды"
        )
      );
      setAvatarEditModalOpen(false);
    }
  };
  const handleUpdateTeam: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Обновляем настройки команды...");
    const updateUserRes = await updateTeam({
      credentials: {
        name: teamName,
        description: teamDescription,
        password: teamPassword,
      },
      token: session?.user.token!,
      teamId: team.id,
    });

    toast.dismiss(toastId);
    if (updateUserRes?.status) {
      toast.success("Настройки успешно обновлены!");
      return router.replace("/team");
    } else {
      toast.error(
        createErrorMessage(
          updateUserRes?.errors,
          "Не удалось обновить настройки!"
        )
      );
    }
  };
  const handleDeleteTeam = useCallback(async () => {
    const toastId = toast.loading("Удаляем команду...");
    const response = await deleteTeam({
      teamId: team.id,
      token: session?.user.token!,
    });
    toast.dismiss(toastId);
    if (response?.status) {
      toast.success("Команда успешно удалена!");
      return router.replace("/team");
    }
    toast.error(createErrorMessage(response?.errors));
  }, []);
  const handleChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files?.length) {
      changeHandler(e);
      return setAvatarEditModalOpen(true);
    }
    setAvatarEditModalOpen(false);
  };
  return (
    <form className={styles.editContainer} onSubmit={handleUpdateTeam}>
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <EditAvatar
        isOpen={isAvatarEditModalOpen}
        onClose={() => setAvatarEditModalOpen(false)}
        fileDataURL={fileDataURL}
        onSuccess={handleSaveImage}
      />
      <DeleteUser
        isOpen={isDeleteTeamModalOpen}
        userLogin={team.name}
        onClose={() => setDeleteTeamModalOpen(false)}
        onSuccess={handleDeleteTeam}
        title="Введите название команды"
        successBtnText="Удалить"
        closeBtnText="Отмена"
      />
      <div className={styles.edit}>
        <input
          ref={inputRef}
          onChange={handleChangeImage}
          type="file"
          accept="image/*"
          hidden
        />
        <span>Изображение команды</span>
        <div>
          <Image
            width={80}
            height={80}
            src={
              team?.avatar
                ? `${process.env.apiUrl}/images/${
                    team?.avatar
                  }?${new Date().getTime()}`
                : "/icons/upload.svg"
            }
            alt="img"
            style={{ borderRadius: "50%" }}
          />
          <span
            onClick={() => inputRef.current?.click()}
            className={styles.loadImgBtn}
          >
            Загрузите аватар команды
          </span>
        </div>
      </div>
      <div className={styles.inputs}>
        <Input
          onChange={(e) => setTeamName(e.currentTarget.value)}
          value={teamName}
          status={
            teamName === ""
              ? "default"
              : teamName.length < 5
              ? "false"
              : teamName.length > 4
              ? "true"
              : "default"
          }
          className={styles.name}
          title="Название команды"
          placeholder="Введите название команды"
          type="text"
        />
        <Input
          onChange={(e) => setTeamDescription(e.currentTarget.value)}
          value={teamDescription}
          status={
            teamDescription === ""
              ? "default"
              : teamDescription.length < 5
              ? "false"
              : teamDescription.length > 4
              ? "true"
              : "default"
          }
          className={styles.description}
          title="Описание команды"
          placeholder="Введите описание команды"
          type="textarea"
        />
        <Input
          onChange={(e) => setPassword(e.currentTarget.value)}
          value={teamPassword}
          status={
            teamPassword === ""
              ? "default"
              : teamPassword.length < 5
              ? "false"
              : teamPassword.length > 4
              ? "true"
              : "default"
          }
          className={styles.password}
          title="Новый пароль команды"
          placeholder="Введите новый пароль команды"
          type="password"
        />
      </div>
      <div className={styles.buttons}>
        <Button
          className={styles.save}
          text="Сохранить изменения"
          variant="green"
          // @ts-ignore
          type="submit"
        />
        
        <Button
          style={{ padding: "0 10px" }}
          // @ts-ignore
          type="button"
          onClick={() => setDeleteTeamModalOpen(true)}
          text="Удалить команду"
          variant="red"
        />
      </div>
    </form>
  );
});
