
import clsx from "clsx";
import Image, { StaticImageData } from "next/image";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Chart } from "../../../CompleteCard/Chart";
import styles from "../CategoryCard.module.scss";

export interface CategoryCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  image: string | StaticImageData;
  title: string;
  desc: string;
  completedTasks: number;
  allTasks: number;
  isHideCompleted?: boolean;
  setIsHideCompleted?: (v: boolean) => void;
  isSelected?: boolean;
}

export const UserCategoryCard = ({
  image,
  className,
  title,
  desc,
  allTasks,
  completedTasks,
  isHideCompleted,
  setIsHideCompleted,
  isSelected
}: CategoryCardProps) => {

  return (
    <div style={{cursor: isSelected ? "default" : "pointer"}} className={clsx(styles.categoryCard, className)}>
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
          {isHideCompleted !== undefined && (
            <div className={styles.isHideCompleted}>
              <label htmlFor="is-show-hide">Скрыть выполненные:</label>
              <input
                name="is-show-hide"
                type="checkbox"
                checked={isHideCompleted}
                onChange={() =>
                  setIsHideCompleted && setIsHideCompleted(!isHideCompleted)
                }
              />
            </div>
          )}
          <span className={styles.desc} dangerouslySetInnerHTML={{__html: desc}}></span>
        </div>
      </div>
      <div className={styles.chart}>
        <Chart
          value={Math.min(Math.round(completedTasks / (allTasks / 100)), 100) || 0}
        />
        <span className={styles.complete}>Выполнено:</span>
        <p>
          {completedTasks}
          <span>/{allTasks}</span>
        </p>
      </div>
    </div>
  );
};
