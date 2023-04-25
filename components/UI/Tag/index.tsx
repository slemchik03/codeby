import { ITag } from "@/page-components";
import clsx from "clsx";
import {
  DetailedHTMLProps,
  Dispatch,
  HTMLAttributes,
  SetStateAction,
  useState,
} from "react";
import styles from "./Tag.module.scss";

export interface TagProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  active: boolean;
  categoryTag: ITag
  setActiveTags: Dispatch<SetStateAction<ITag[]>>;
}

export const Tag = ({
  className,
  active,
  setActiveTags,
  categoryTag
}: TagProps) => {
  const [show, setShow] = useState<boolean>(active);

  const handleTagClick = () => {
    setShow(!show);
    setActiveTags((prevTags) => {
      return active
        ? prevTags.filter((tag) => tag.id !== categoryTag.id)
        : [...prevTags, { ...categoryTag }];
    });
  };

  return (
    <div
      onClick={handleTagClick}
      className={clsx(className, styles.tag)}
      style={{ backgroundColor: show ? categoryTag.color : "", color: show ? "var(--background-secondary)" : "" }}
    >
      <p>{categoryTag.title}</p>
    </div>
  );
};
