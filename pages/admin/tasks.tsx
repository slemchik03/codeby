import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { withLayout } from "@/layout/Layout";
import { AddTask, AdminTasks, Card } from "@/page-components";
import { EditTask } from "@/page-components/Admin/EditTask";
import getTasks from "@/utils/server/get/getTasks";
import getUser from "@/utils/server/get/getUser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC, useMemo, useState } from "react";
import styles from "../../styles/Admin.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import { ITask } from "@/utils/server/get/getTask";
import Head from "next/head";
import { Select } from "@/components";
import { useQuery } from "react-query";
import getCategories from "@/utils/server/get/getCategories";
import { useSession } from "next-auth/react";

interface IProps {
  tasks: ITask[];
}

const Tasks: FC<IProps> = ({ tasks }) => {
  const { data: session } = useSession();
  const [category, setCategory] = useState<string | null>(null);
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const { data: categoryList } = useQuery("categories", () =>
    getCategories({ limit: 30, hidden: false, token: session?.user.token! })
  );
  const categoriesTitle = useMemo(() => {
    if (categoryList && Array.isArray(categoryList)) {
      return categoryList.map((cat) => cat.title);
    }
    return [];
  }, [categoryList]);

  const selectedCategoryId = useMemo(() => {
    if (category) {
      const needle = categoryList?.find((v) => v.title === category);
      return needle ? needle.id : null;
    }
    return null;
  }, [category]);

  return (
    <>
      <Head>
        <title>Игры Кодебай | Задания</title>
      </Head>
      <div className={styles.admin}>
        <AdminLayout setAdd={setAdd} setEdit={setEdit}>
          <Card className={styles.selectFilterCard} contentStyle={{zIndex: 8000}}>
              <Select
                className={styles.select}
                active={category || "Все"}
                setActive={(v) => setCategory(v + "")}
                showTitle={false}
                type="select"
                variant="gray"
                options={categoriesTitle}
                title="Категория"
              />
          </Card>
          {add ? (
            <AddTask setAdd={setAdd} type="add" />
          ) : edit ? (
            <EditTask
              categoryList={categoryList || []}
              setEdit={setEdit}
              type="edit"
            />
          ) : (
            <AdminTasks
              categoryFilterId={selectedCategoryId}
              tasks={tasks}
              setEdit={setEdit}
            />
          )}
        </AdminLayout>
      </div>
    </>
  );
};

export default withLayout(Tasks, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    id: session?.user.id!,
    token: session?.user.token!,
  });

  if (user?.role === "администратор") {
    const tasks = await getTasks({
      limit: 100,
      token: session?.user.token!,
    });
    return {
      props: {
        tasks: tasks || [],
        session,
      },
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
