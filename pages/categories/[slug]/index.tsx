import { withLayout } from "@/layout/Layout";
import styles from "../../../styles/Tasks.module.scss";
import Link from "next/link";
import { FC, useCallback, useMemo, useState } from "react";
import getTasks from "@/utils/server/get/getTasks";
import { TaskCardUser } from "@/page-components/Categories/TaskCardUser";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSideProps } from "next/types";
import { useInfiniteQuery } from "react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import getCategory, { ICategory } from "@/utils/server/get/getCategory";
import { ITask } from "@/utils/server/get/getTask";
import Head from "next/head";
import { UserCategoryCard } from "@/page-components/Categories/CategoryCard/UserCategoryCard";
import { Button } from "@/components";
import getUser from "@/utils/server/get/getUser";

interface IProps {
  category: ICategory;
  tasks: ITask[];
  teamId: string;
  categoriesScoreboard: IScoreboardCategories;
}

const Tasks: FC<IProps> = ({ category, tasks, categoriesScoreboard, teamId }) => {
  const router = useRouter();
  const [isHideCompletedTasks, setHideCompletedTasks] = useState(false);
  const { data: session } = useSession();

  const currentCategoryScoreboard = useMemo(
    () =>
      categoriesScoreboard?.categories?.find(({ id }) => id === category.id),
    [categoriesScoreboard]
  );


  const fetchTasks = useCallback(({ pageParam = 0 }) =>
    getTasks({
      limit: 10,
      offset: pageParam,
      token: session?.user.token!,
      categoryId: category.id,
    }).then((response) => response || []), []);


  // @ts-ignore
  const {
    data: infinityTasksResponse,
    fetchNextPage: fetchNextTasksPage,
    hasNextPage,
  } = useInfiniteQuery(["tasks", router.query["slug"]], fetchTasks, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.length === 10) {
        return pages.length * 10;
      }
    },
      // @ts-ignore
    initialData: { pages: [tasks] },
  });

  const infinityTasksPages = (infinityTasksResponse?.pages ||
    []) as unknown as ITask[][];
  const infinityTasks = infinityTasksPages.flat();

  const filteredTasks = useMemo(() => {
    if (isHideCompletedTasks) {
      return infinityTasks?.filter(
        (task) => !task.completed
      );
    }
    return infinityTasks;
  }, [isHideCompletedTasks, infinityTasks]);

  const loadMoreHandler = useCallback(() => {
    const infinityTasksLength = infinityTasks?.length || 0;
    if (infinityTasksLength % 10 === 0) {
      fetchNextTasksPage({ pageParam: infinityTasksLength });
    }
  }, [])

  return (
    <>
      <Head>
        <title>Игры Кодебай | «{category.title}»</title>
      </Head>
      <div className={styles.tasks}>
        <UserCategoryCard
          isSelected
          id={category.id}
          image={category.image}
          title={category.title}
          desc={category.description}
          allTasks={
            currentCategoryScoreboard ? currentCategoryScoreboard?.all_tasks : 1
          }
          completedTasks={
            currentCategoryScoreboard
              ? currentCategoryScoreboard?.completed_tasks
              : 0
          }
          isHideCompleted={isHideCompletedTasks}
          setIsHideCompleted={setHideCompletedTasks}
        />
        <div className={styles.taskCards}>
          {filteredTasks &&
            filteredTasks?.map(
              ({ id, difficult, description, title, image, completed }) => {
                return (
                  <Link key={id} href={`/categories/${category.slug}/${id}`}>
                    <TaskCardUser
                      status={difficult}
                      title={title}
                      desc={description}
                      image={image}
                      check={completed}
                    />
                  </Link>
                );
              }
            )}
        </div>
        {hasNextPage && (
          <div className={styles.loadMore}>
            <Button
              onClick={loadMoreHandler}
              text="Загрузить ещё"
              variant="green"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default withLayout(Tasks, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    token: session?.user.token!,
    id: session?.user.id!,
  });
  const { query } = ctx;
  const category = await getCategory({
    token: session?.user.token!,
    hidden: false,
    slug: Array.isArray(query["slug"]) ? query["slug"][0] : query["slug"],
  });
  const tasks = await getTasks({
    limit: 10,
    token: session?.user.token!,
    hidden: false,
    categoryId: !Array.isArray(category) ? category?.id : category[0].id,
  });
  const categoriesScoreboard = await getScoreboardCategories({
    token: session?.user.token!,
    teamId: user?.team_id!,
  });

  
  if (!category) {
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
      tasks: tasks || [],
      teamId: user?.team_id || "",
      categoriesScoreboard,
      session,
    },
  };
};
