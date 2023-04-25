import { TaskCardAdmin } from "@/page-components/Categories/TaskCardAdmin";
import { setTaskToUpdate } from "@/redux/admin/slice";
import { FC } from "react";
import { useDispatch } from "react-redux";
import styles from "./AdminTasks.module.scss";
import { ITask } from "@/utils/server/get/getTask";

interface IProps {
  tasks: ITask[];
  setEdit: (v: boolean) => void;
  categoryFilterId: string | null;
}

export const AdminTasks: FC<IProps> = ({
  tasks,
  setEdit,
  categoryFilterId,
}) => {
  const dispatch = useDispatch();
  return (
    <div className={styles.adminTasks}>
      {tasks.map((task) => {
        const { title, description, hidden, id, image, category_id } = task;
        if (!categoryFilterId) {
          return (
            <TaskCardAdmin
              key={id}
              id={id}
              categoryId={category_id}
              setEdit={(v) => {
                setEdit(v);
                dispatch(setTaskToUpdate(task));
              }}
              hidden={hidden}
              className={styles.card}
              title={title}
              desc={description}
              image={image}
              category="dss"
            />
          );
        }
        return (
          categoryFilterId === category_id && (
            <TaskCardAdmin
              key={id}
              id={id}
              categoryId={category_id}
              setEdit={(v) => {
                setEdit(v);
                dispatch(setTaskToUpdate(task));
              }}
              hidden={hidden}
              className={styles.card}
              title={title}
              desc={description}
              image={image}
              category="dss"
            />
          )
        );
      })}
    </div>
  );
};
