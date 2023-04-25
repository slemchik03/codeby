import clsx from "clsx";
import Image from "next/image";
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  HTMLAttributes,
  useRef,
  useState,
} from "react";
import styles from "./Profile.module.scss";
import Arrow from "../../public/icons/ArrowDown.svg";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { signOut, useSession } from "next-auth/react";
import { EditAvatar } from "../Modal/EditAvatar";
import useUploadImage from "@/hooks/useUploadImage";
import toast, { Toaster } from "react-hot-toast";
import updateUserImage from "@/utils/server/update/updateUserImage";
import { useRouter } from "next/router";

export interface ProfileProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Profile = ({ className }: ProfileProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const user = useUser();
  const inputRef = useRef<HTMLInputElement>(null);
  const { fileDataURL, changeHandler } = useUploadImage();
  const { data: session } = useSession();
  const [isAvatarEditModalOpen, setAvatarEditModalOpen] = useState(false);
  const isCanToChangeAvatar = router.pathname.includes("settings");

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

  const onSignOut = () => {
    setOpen(false);
    signOut();
  };
  const handleToUploadImage = () => {
    isCanToChangeAvatar && inputRef?.current?.click()
  }
  return (
    <div className={styles.profile}>
      {isCanToChangeAvatar && (
        <>
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
        </>
      )}
      <div className={styles.wrapper} onClick={() => setOpen(!open)}>
        <Image
          src={
            user?.avatar
              ? `${process.env.apiUrl}/images/${
                  user?.avatar
                }?${new Date().getTime()}`
              : "/icons/upload.svg"
          }
          alt=""
          width={40}
          height={40}
          onClick={handleToUploadImage}
        />
        <input
          ref={inputRef}
          onChange={handleChangeImage}
          type="file"
          accept="image/*"
          hidden
        />
        <div className={clsx({ [styles.arrowOpen]: open })}>
          <Arrow className={styles.arrow} />
        </div>
      </div>
      {open && (
        <ul className={styles.dropdown}>
          <Link onClick={() => setOpen(false)} href="/profile">
            <li>Профиль</li>
          </Link>
          <Link onClick={() => setOpen(false)} href="/settings">
            <li>Редактировать профиль</li>
          </Link>
          <Link onClick={onSignOut} href="/">
            <li>Выйти</li>
          </Link>
        </ul>
      )}
    </div>
  );
};
