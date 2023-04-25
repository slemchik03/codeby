import clsx from "clsx";
import { DetailedHTMLProps, FormEvent, HTMLAttributes, useState } from "react";
import { IconButton } from "../IconButton";
import styles from "./InputWithIcons.module.scss";

export interface InputProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  title?: string;
  placeholder?: string;
  type: "text" | "textarea" | "email" | "password" | "file";
  desc?: string;
  status: "default" | "true" | "false";
  value: string | number;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  deleteHandler: () => void;
  updateHandler: () => void;
}

export const InputWithIcons = ({
  onChange,
  status,
  className,
  title,
  placeholder,
  type,
  value,
  deleteHandler,
  updateHandler,
}: InputProps) => {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <div className={clsx(className, styles.inputContainer)}>
      <span className={styles.title}>{title}</span>
      <div className={styles.inputWithIcons}>
        <input
          disabled={!isEdit}
          onBlur={updateHandler}
          onChange={onChange}
          value={value}
          className={clsx(
            { [styles.default]: status === "default" },
            { [styles.true]: status === "true" },
            { [styles.false]: status === "false" }
          )}
          type={type}
          placeholder={placeholder}
        />
        <IconButton
          type="edit"
          style={{
            marginTop: "0px",
            height: "48px",
            width: "30px",
            borderRadius: "0",
          }}
          onClick={() => setIsEdit((v) => !v)}
        />
        <IconButton
          type="delete"
          style={{
            marginTop: "0px",
            height: "48px",
            width: "30px",
            borderRadius: "0 8px 8px 0",
          }}
          onClick={deleteHandler}
        />
      </div>
    </div>
  );
};
