import { ChangeEventHandler, memo, useRef, useState } from "react";
import styles from "./Edit.module.scss";
import { Input } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import { selectSetting } from "@/redux/settings/selector";

import {
  updateBiography,
  updateFullName,
  updateGithubUrl,
  updateLogin,
  updateTelegramMention,
} from "@/redux/settings/slice";
import Image from "next/image";
import { EditAvatar } from "@/components/Modal/EditAvatar";
import updateUserImage from "@/utils/server/update/updateUserImage";
import useUploadImage from "@/hooks/useUploadImage";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import useUser from "@/hooks/useUser";

export const Edit = memo(() => {
  const { full_name, telegram_mention, login, github_url, biography } =
    useSelector(selectSetting);
  const user = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const { fileDataURL, changeHandler } = useUploadImage();
  const { data: session } = useSession();
  const [isAvatarEditModalOpen, setAvatarEditModalOpen] = useState(false);

  const handleSaveImage = async (dataUrl?: any) => {
    if (dataUrl) {
      const toastId = toast.loading("Обновляем аватар профиля...");
      const result = await fetch(dataUrl);
      const blob = await result.blob();
      const file = new File([blob], "avatar.png", { type: blob.type });

      const response = await updateUserImage({
        id: session?.user.id!,
        file: file!,
        token: session?.user.token!,
      });
      toast.dismiss(toastId);
      if (response) {
        toast.success("Аватар успешно обновлён!");
        return setAvatarEditModalOpen(false);
      }
      toast.error("Не удалось обновить аватар");
    }
  };

  const handleChangeImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files?.length) {
      changeHandler(e);
      return setAvatarEditModalOpen(true);
    }
    setAvatarEditModalOpen(false);
  };
  return (
    <form>
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
      <div className={styles.edit}>
        <input
          ref={inputRef}
          onChange={handleChangeImage}
          type="file"
          accept="image/*"
          hidden
        />
        <span>Изображение профиля</span>
        <div>
          <Image
            width={80}
            height={80}
            src={
              user?.avatar
                ? `${process.env.apiUrl}/images/${
                    user?.avatar
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
            Загрузите аватар
          </span>
        </div>
      </div>
      <div className={styles.inputs}>
        <Input
          onChange={(e) => dispatch(updateFullName(e.currentTarget.value))}
          value={full_name}
          status={
            full_name === ""
              ? "default"
              : full_name.length < 5
              ? "false"
              : full_name.length > 4
              ? "true"
              : "default"
          }
          className={styles.name}
          title="Полное имя"
          placeholder="Введите своё полное имя"
          type="text"
        />
        <Input
          onChange={(e) =>
            dispatch(updateTelegramMention(e.currentTarget.value))
          }
          value={telegram_mention}
          status={
            telegram_mention === ""
              ? "default"
              : telegram_mention.length < 5
              ? "false"
              : telegram_mention.length > 4
              ? "true"
              : "default"
          }
          className={styles.telegram}
          title="Telegram:"
          placeholder="Вставьте ссылку в формате @codeby_games"
          type="text"
        />
        <Input
          onChange={(e) => dispatch(updateLogin(e.currentTarget.value))}
          value={login}
          status={
            login === ""
              ? "default"
              : login.length < 3
              ? "false"
              : login.length >= 3
              ? "true"
              : "default"
          }
          className={styles.nickname}
          title="Никнейм"
          placeholder="Введите новый никнейм"
          type="text"
        />
        <Input
          onChange={(e) => dispatch(updateGithubUrl(e.currentTarget.value))}
          value={github_url}
          status={
            github_url === ""
              ? "default"
              : github_url.length < 5
              ? "false"
              : github_url.length > 4
              ? "true"
              : "default"
          }
          className={styles.github}
          title="GitHub:"
          placeholder="Вставьте ссылку"
          type="text"
        />
        <Input
          onChange={(e) => dispatch(updateBiography(e.currentTarget.value))}
          value={biography}
          status="default"
          className={styles.about}
          title="Обо мне"
          placeholder="Напишите здесь описание профиля, например, ваши хобби, интересы и т.д."
          type="textarea"
        />
      </div>
    </form>
  );
});
