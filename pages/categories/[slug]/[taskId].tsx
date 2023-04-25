import { withLayout } from "@/layout/Layout";
import { TaskAddition, TaskDescription } from "@/page-components";
import styles from "../../../styles/Tasks.module.scss";
import { FC, useEffect, useMemo, useState } from "react";
import getHints, { IHint } from "@/utils/server/get/getHints";
import getPartsOfTask, { IPartOfTask } from "@/utils/server/get/getPartsOfTask";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import getCategory, { ICategory } from "@/utils/server/get/getCategory";
import getTask, { ITask } from "@/utils/server/get/getTask";
import Head from "next/head";
import { UserCategoryCard } from "@/page-components/Categories/CategoryCard/UserCategoryCard";
import getUser from "@/utils/server/get/getUser";

interface IProps {
  category: ICategory;
  task: ITask;
  hints: IHint[];
  dockerPartsOfTask: IPartOfTask[];
  filePartsOfTask: IPartOfTask[];
  categoriesScoreboard: IScoreboardCategories;
}

const Task: FC<IProps> = ({
  category,
  task,
  hints,
  dockerPartsOfTask,
  filePartsOfTask,
  categoriesScoreboard,
}) => {
  const [timeUntilRestart, setTimeUntilRestart] = useState<Date | undefined>(
    undefined
  );
  const { image, title, description, id: categoryId } = category;
  const { id: taskId } = task;
  const currentCategoryScoreboard = useMemo(
    () => categoriesScoreboard?.categories?.find(({ id }) => id === category.id),
    [categoriesScoreboard]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const lastRestart = new Date(task.last_restart).getTime();
      const nextRestart = lastRestart + task.restart_every_minutes * 60 * 1000;
      const timeLeft = nextRestart - now;
      if (timeLeft > 0) {
        setTimeUntilRestart(new Date(timeLeft));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [task]);

  
  return (
    <>
      <Head>
        <title>{`Игры Кодебай | «${task.title}»`}</title>
      </Head>
      <div className={styles.task}>
        <UserCategoryCard
        isSelected
          id={categoryId}
          image={image}
          title={title}
          desc={description}
          allTasks={
            currentCategoryScoreboard ? currentCategoryScoreboard?.all_tasks : 1
          }
          completedTasks={
            currentCategoryScoreboard
              ? currentCategoryScoreboard?.completed_tasks
              : 0
          }
        />
        <div className={styles.cards}>
          <TaskDescription
            isCompletedTask={task.completed}
            portList={dockerPartsOfTask?.map(({ data }) => data)}
            image={task.image}
            points={task.points}
            className={styles.desc}
            title={task.title}
            desc={task.description}
            taskId={taskId}
          />
          <TaskAddition
            categorySlug={category.slug}
            className={styles.addition}
            timeLeft={timeUntilRestart}
            files={filePartsOfTask}
            hints={hints}
          />
        </div>
      </div>
    </>
  );
};

export default withLayout(Task, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({token: session?.user.token!, id: session?.user.id!})
  const { query } = ctx;
  const category = await getCategory({
    token: session?.user.token!,
    hidden: false,
    slug: Array.isArray(query["slug"]) ? query["slug"][0] : query["slug"],
  });
  const task = await getTask({
    token: session?.user.token!,
    hidden: false,
    categoryId: Array.isArray(category) ? category[0].id : category?.id,
    taskId: Array.isArray(query["taskId"])
      ? query["taskId"][0]
      : query["taskId"],
  });
  const hints = await getHints({
    limit: 20,
    token: session?.user.token!,
    taskId: Array.isArray(query["taskId"])
      ? query["taskId"][0]
      : query["taskId"]!,
  });

  const dockerPartsOfTask = await getPartsOfTask({
    limit: 20,
    token: session?.user.token!,
    active: true,
    type: "docker",
    taskId: Array.isArray(query["taskId"])
      ? query["taskId"][0]
      : query["taskId"]!,
  });
  const filePartsOfTask = await getPartsOfTask({
    limit: 20,
    token: session?.user.token!,
    active: true,
    type: "файлы",
    taskId: Array.isArray(query["taskId"])
      ? query["taskId"][0]
      : query["taskId"]!,
  });
  const categoriesScoreboard = await getScoreboardCategories({
    token: session?.user.token!,
    teamId: user?.team_id!,
  });

  if (!category || !task) {
    return {
      redirect: {
        destination: "/categories/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      category: category,
      task,
      hints,
      dockerPartsOfTask,
      filePartsOfTask,
      categoriesScoreboard,
      session,
    },
  };
};
