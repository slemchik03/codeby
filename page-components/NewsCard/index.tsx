import clsx from "clsx";
import { IconButton, MoreOptions } from "@/components";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import styles from "./NewsCard.module.scss";

import Time from "../../public/icons/time.svg";
import deleteNews from "@/utils/server/delete/deleteNews";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import { ConfirmAct } from "@/components/Modal/ConfirmAct";

export interface NewsCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  options?: boolean;
  created_at: string;
  title: string;
  description: string;
  color: "black" | "gray";
  settings?: boolean;
  id: string;
  hidden: boolean;
  setEdit: (v: boolean) => void;
}

export const NewsCard = ({
  className,
  created_at,
  title,
  description,
  color,
  settings,
  id,
  hidden,
  setEdit,
}: NewsCardProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isDeleteNewsModalOpen, setDeleteNewsModalOpen] = useState(false);
  const publishedTime = new Date(created_at);

  const { data: session } = useSession();
  const router = useRouter();

  const deleteHandler = async () => {
    setDeleteNewsModalOpen(false)
    const res = await deleteNews({ newsId: id, token: session?.user.token! });
    if (res?.status) {
      toast.success("Новость успешно удалена!");
      return router.push("/admin/news");
    }
    toast.error("Не удалось удалить новость!");
  };

  return (
    <div
      className={clsx(
        styles.newsCard,
        { [styles.newsCardBlack]: color === "black" },
        { [styles.newsCardGray]: color === "gray" },
        className
      )}
    >
      <Toaster
        toastOptions={{
          style: {
            background: "#282c35",
            color: "#ffff",
          },
        }}
      />
      <ConfirmAct
        successBtnText="Удалить"
        closeBtnText="Закрыть"
        title="Подтвердите действие"
        isOpen={isDeleteNewsModalOpen}
        onClose={() => setDeleteNewsModalOpen(false)}
        onSuccess={deleteHandler}
      />
      {settings && (
        <div className={styles.badges}>
          <IconButton
            onClick={() => setShowMore(!showMore)}
            type="more"
            className={styles.dots}
          />
          {showMore && (
            <MoreOptions
              deleteHandler={() => setDeleteNewsModalOpen(true)}
              setOpen={setShowMore}
              setEdit={setEdit}
              tasks={false}
              hidden={hidden}
              className={styles.moreOptions}
            />
          )}
        </div>
      )}

      <span className={styles.title}>{title}</span>
      <div dangerouslySetInnerHTML={{__html: description}}></div>
      <div className={styles.publish}>
        <Time />
        Опубликовано{" "}
        {`${publishedTime?.getDate().toString().padStart(2, "0")}.${(
          publishedTime?.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}.${publishedTime?.getFullYear()} ${publishedTime
          ?.getHours()
          .toString()
          .padStart(2, "0")}:${publishedTime
          ?.getMinutes()
          .toString()
          .padStart(2, "0")}`}
      </div>
    </div>
  );
};
