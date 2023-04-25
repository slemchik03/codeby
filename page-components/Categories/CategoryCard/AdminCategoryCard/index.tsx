import { IconButton, MoreOptions } from "@/components";
import { ConfirmAct } from "@/components/Modal/ConfirmAct";
import deleteCategory from "@/utils/server/delete/deleteCategory";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Image, { StaticImageData } from "next/image";
import { useRouter } from "next/router";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "../CategoryCard.module.scss";

export interface CategoryCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  image: string | StaticImageData;
  title: string;
  desc: string;
  hidden: boolean;
  setEdit: (v: boolean) => void;
  id: string;
}

export const AdminCategoryCard = ({
  image,
  className,
  title,
  desc,
  setEdit,
  hidden,
  id,
}: CategoryCardProps) => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [isDeleteCategoryModalOpen, setDeleteCategoryModalOpen] =
    useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const deleteHandler = async () => {
    const res = await deleteCategory({
      categoryId: id,
      token: session?.user.token!,
    });
    if (res?.status) {
      toast.success("Категория успешно удалена!");
      return router.push("/admin/categories");
    }
    toast.error("Не удалось удалить категорию!");
    setEdit(false);
  };

  return (
    <div className={clsx(styles.categoryCard, className)}>
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
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => setDeleteCategoryModalOpen(false)}
        onSuccess={deleteHandler}
      />
      <div className={styles.left}>
        <Image
          width={316}
          height={140}
          src={
            image
              ? `${process.env.apiUrl}/images/${image}?${new Date().getTime()}`
              : "/icons/upload-category.svg"
          }
          alt=""
        />
        <div className={styles.info}>
          <span className={styles.title}>{title}</span>
          <span className={styles.desc} dangerouslySetInnerHTML={{__html: desc}}></span>
        </div>
      </div>

      <IconButton
        onClick={() => setShowMore(!showMore)}
        className={styles.moreButton}
        type="more"
      />

      {showMore && (
        <MoreOptions
          hidden={hidden}
          setEdit={setEdit}
          deleteHandler={() => setDeleteCategoryModalOpen(true)}
          setOpen={setShowMore}
          tasks={false}
          className={styles.moreOptions}
        />
      )}
    </div>
  );
};
