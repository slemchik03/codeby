import clsx from "clsx";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
} from "react";
import styles from "./MoreOptions.module.scss";

export interface MoreOptionsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  tasks: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  hidden?: boolean;
  deleteHandler: () => any;
  setEdit: (v: boolean) => void;
  setShowUploadModalOpen?: (v: boolean) => void;
  setShowPartsModalOpen?: (v: boolean) => void;
}

export const MoreOptions = ({
  className,
  tasks,
  setOpen,
  deleteHandler,
  setEdit,
  setShowPartsModalOpen,
  setShowUploadModalOpen
}: MoreOptionsProps) => {


  const onDelete = () => {
    deleteHandler();
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(false);
    setEdit(true);
  };
  return (
    <>
      <div className={clsx(styles.moreOptions, className)}>
        {tasks && (
          <>
            <span
              onClick={() => {
                setShowUploadModalOpen && setShowUploadModalOpen(true)
                setEdit(false);
                setOpen(false);
              }}
            >

              Добавить части задания
            </span>

            <span
              onClick={() => {
                setShowPartsModalOpen && setShowPartsModalOpen(true)
                setEdit(false);
                setOpen(false);
              }}
            >
              Посмотреть части задания
            </span>
          </>
        )}
        <span onClick={onEdit}>Редактировать</span>
        <span onClick={onDelete}>Удалить</span>
      </div>
    </>
  );
};
