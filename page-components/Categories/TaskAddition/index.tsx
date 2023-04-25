import clsx from "clsx";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Card } from "@/page-components/Card";
import styles from "./TaskAddition.module.scss";
import { Button, Select } from "@/components";
import Link from "next/link";
import { IHint } from "@/utils/server/get/getHints";
import { IPartOfTask } from "@/utils/server/get/getPartsOfTask";
import { SelectFile } from "@/components/UI/Select/File";

export interface TaskAdditionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  timeLeft: Date | undefined;
  hints: IHint[];
  files: IPartOfTask[];
  categorySlug: string;
}

export const TaskAddition = ({
  className,
  timeLeft,
  hints,
  files,
  categorySlug,
}: TaskAdditionProps) => {
  return (
    <div className={clsx(styles.taskAddition, className)}>
      <Card title="До перезагрузки задания">
        <div className={styles.timeLeft}>
          <span>
            {timeLeft
              ? `${timeLeft.getMinutes().toString().padStart(2, "0")}:${timeLeft
                  .getSeconds()
                  .toString()
                  .padStart(2, "0")}`
              : "00:00"}
          </span>
        </div>
        {files?.length && (
          <SelectFile
            variant="gray"
            showTitle
            className={styles.files}
            title="Файлы"
            options={files}
          />
        )}
        <div className={styles.helps}>
          {hints?.map(({ description, id }, idx) => (
            <Select
              key={id}
              type="dropdown"
              copyableOption
              variant="gray"
              showTitle
              title={`Подсказка №${idx + 1}`}
              options={[description]}
            />
          ))}
        </div>
        <Link href={`/categories/${categorySlug}`}>
          <Button variant="white" text="Вернуться к категориии" />
        </Link>
      </Card>
    </div>
  );
};
