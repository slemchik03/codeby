import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Chart } from "./Chart";
import RightArrow from "../../public/icons/RightArrow.svg";
import styles from "./CompleteCard.module.scss";
import Link from "next/link";
import { useQuery } from "react-query";
import getCategory from "@/utils/server/get/getCategory";
import { useSession } from "next-auth/react";

export interface CompleteCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  date: string;
  title: string;
  completedTasks: number;
  allTasks: number;
  categoryId: string;
}

export const CompleteCard = ({
  className,
  date,
  completedTasks,
  allTasks,
  title,
  categoryId,
}: CompleteCardProps) => {
  const completeCardDate = new Date(date);
  const { data: session } = useSession();
  const { data: category } = useQuery("category-" + categoryId, () =>
    getCategory({ categoryId, token: session?.user.token! })
  );

  return (
    <Link href={`/categories/${category ? category?.slug : ""}`}>
      <div className={clsx(styles.completeCard, className)}>
        <div className={styles.left}>
          <Chart
            value={Math.min(Math.round(completedTasks / (allTasks / 100)), 100) || 0}
          />
          <div className={styles.info}>
            <p className={styles.title}>{title}</p>
            <p className={styles.date}>
              {completeCardDate.getTime() > 0
                ? `${completeCardDate.getDate().toString().padStart(2, "0")}.${(
                    completeCardDate.getMonth() + 1
                  )
                    .toString()
                    .padStart(
                      2,
                      "0"
                    )}.${completeCardDate.getFullYear()} ${completeCardDate
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${completeCardDate
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : ""}
            </p>
          </div>
          <p className={styles.completedTaskCount}>
            {completedTasks}/{allTasks}
          </p>
        </div>
        <RightArrow />
      </div>
    </Link>
  );
};
