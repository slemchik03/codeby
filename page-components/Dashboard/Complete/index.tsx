import { CompleteCard } from "@/page-components/CompleteCard";
import { IScoreboardCategories } from "@/utils/server/get/getScoreboardCategories";
import { FC } from "react";
import styles from "./Complete.module.scss";
import { NoComplete } from "./NoComplete";

interface IProps {
  categoriesScoreboard: IScoreboardCategories;
}

export const Complete: FC<IProps> = ({ categoriesScoreboard }) => {

  return (
    <div className={styles.complete}>
      {categoriesScoreboard?.categories?.length ? (
        categoriesScoreboard?.categories?.map(
          ({ id, title, completed_tasks, all_tasks, updated_at }) => (
            <CompleteCard
              categoryId={id}
              key={id}
              title={title}
              completedTasks={completed_tasks}
              allTasks={all_tasks}
              date={updated_at}
            />
          )
        )
      ) : (
        <NoComplete />
      )}
    </div>
  );
};
