import Image from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { TaskStatus } from "@/types/task";
import { Check, Status } from "@/components";
import styles from "../TaskCardAdmin/TaskCard.module.scss";
import clsx from "clsx";


export interface TaskCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  status?: TaskStatus;
  title: string;
  desc: string;
  image?: string;
  check?: boolean;
}

export const TaskCardUser = ({
  className,
  title,
  desc,
  status,
  image,
  check
}: TaskCardProps) => {
 
  
  return (
    <div className={clsx(styles.taskCard, className)}>
      <div className={styles.top}>
        {/*<Image*/}
        {/*  src={*/}
        {/*    image*/}
        {/*      ? `${process.env.apiUrl}/images/${image}?${new Date().getTime()}`*/}
        {/*      : "/icons/upload.svg"*/}
        {/*  }*/}
        {/*  width={30}*/}
        {/*  height={30}*/}
        {/*  alt=""*/}
        {/*/>*/}о
        {status && <Status status={status} />}
      </div>
      <p className={styles.title}>{title}</p>
      <p className={styles.desc}>{desc}</p>
      <div className={styles.bottom}>
        <button>Подробнее</button>
        <Check check={!!check} />
      </div>
    </div>
  );
};
