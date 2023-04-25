import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { TaskStatus } from "@/types/task";
import { IconButton, MoreOptions } from "@/components";
import styles from "./TaskCard.module.scss";
import clsx from "clsx";
import { useRouter } from "next/router";
import deleteTask from "@/utils/server/delete/deleteTask";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import toast, { Toaster } from "react-hot-toast";
import getCategory from "@/utils/server/get/getCategory";
import { ConfirmAct } from "@/components/Modal/ConfirmAct";
import { PartUpload } from "@/components/Modal/PartUpload";
import { PartList } from "@/components/Modal/PartList";

export interface TaskCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status?: TaskStatus;
  title: string;
  desc: string;
  check?: boolean;
  category?: string;
  image?: string;
  setEdit: (v: boolean) => void;
  id: string;
  categoryId: string;
}

export const TaskCardAdmin = ({
  className,
  category,
  title,
  desc,
  image,
  setEdit,
  hidden,
  id,
  categoryId,
}: TaskCardProps) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [isDeleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [isShowUploadModalOpen, setShowUploadModalOpen] = useState(false);
  const [isShowPartsModalOpen, setShowPartsModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { data: categoryInfo } = useQuery("category-" + categoryId, () =>
    getCategory({
      token: session?.user.token!,
      categoryId: categoryId,
      hidden: false,
    })
  );

  const deleteHandler = async () => {
    setDeleteTaskModalOpen(false);
    const res = await deleteTask({
      taskId: id,
      token: session?.user.token!,
    });
    if (res?.status) {
      toast.success("Задание успешно удалено!");
      return router.push("/admin/tasks");
    }
    toast.error("Не удалось удалить задание!");

    setEdit(false);
  };

  return (
    <div className={clsx(styles.taskCard, className)}>
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
        isOpen={isDeleteTaskModalOpen}
        onClose={() => setDeleteTaskModalOpen(false)}
        onSuccess={deleteHandler}
      />
      <PartUpload
        isOpen={isShowUploadModalOpen}
        onClose={() => setShowUploadModalOpen(false)}
      />
      <PartList
        isOpen={isShowPartsModalOpen}
        onClose={() => setShowPartsModalOpen(false)}
      />
      <div className={styles.top}>
        <Image
          src={
            image
              ? `${process.env.apiUrl}/images/${image}?${new Date().getTime()}`
              : "/icons/upload.svg"
          }
          width={30}
          height={30}
          alt=""
        />
        <IconButton onClick={() => setShowOptions(!showOptions)} type="more" />
        {showOptions && (
          <MoreOptions
            setEdit={setEdit}
            hidden={hidden}
            deleteHandler={() => setDeleteTaskModalOpen(true)}
            setOpen={setShowOptions}
            setShowPartsModalOpen={setShowPartsModalOpen}
            setShowUploadModalOpen={setShowUploadModalOpen}
            tasks
            className={styles.moreOptions}
          />
        )}
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.desc} dangerouslySetInnerHTML={{__html: desc}}></p>
      <div className={styles.info}>
        {category && id && (
          <>
            <div>
              <p>Категория</p>
              <p>ID</p>
            </div>
            <div>
              <span>{!Array.isArray(categoryInfo) && categoryInfo?.title}</span>
              <span>{id}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
