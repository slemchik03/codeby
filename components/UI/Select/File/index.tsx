import getFile from "@/utils/server/get/getFile";
import { IPartOfTask } from "@/utils/server/get/getPartsOfTask";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useRef,
  useState,
} from "react";
import ArrowIcon from "../../../../public/icons/select-arrow.svg";
import styles from "../Select.module.scss";
import toast from "react-hot-toast";

export interface SelectProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  active?: string;
  setActive?: Dispatch<SetStateAction<string>>;
  options: IPartOfTask[];
  title: string;
  showTitle: boolean;
  variant: "gray" | "black";
}

export const SelectFile = ({
  active,
  className,
  options,
  title,
  showTitle,
  variant,
}: SelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const handleDownloadFile = async ({ data, system_data }: IPartOfTask) => {
    const toastId = toast.loading("Скачивание файла...");

    const downloadUrl = await getFile({
      token: session?.user.token!,
      folder: system_data.split("/")[0],
      fileName: data.split(".")[0],
      fileType: data.split(".")[1],
    });
    if (linkRef.current) {
      linkRef.current.href = downloadUrl!;
      linkRef.current.download = data;
      linkRef.current.click();
    }

    toast.dismiss(toastId);
  };

  return (
    <div
      onClick={() => setOpen(!open)}
      className={clsx(
        className,
        styles.dropdownContainer,
        { [styles.black]: variant === "black" },
        { [styles.gray]: variant === "gray" }
      )}
    >
      {showTitle && <p>{title}</p>}
      {!showTitle && <p>{active}</p>}
      {open && (
        <div className={styles.options}>
          <ul>
            {options.map((filePart, idx) => {
              return (
                <li
                  className={styles.hoverLi}
                  onClick={() => handleDownloadFile(filePart)}
                  key={idx}
                >
                  {filePart.data}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <ArrowIcon className={clsx({ [styles.openArrow]: open })} />
      <a ref={linkRef} style={{ display: "none" }}></a>
    </div>
  );
};
