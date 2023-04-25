import AdminLayout from "@/components/AdminLayout/AdminLayout";
import { withLayout } from "@/layout/Layout";
import { AddCategory } from "@/page-components/Admin/AddCategory";
import { AdminCategories } from "@/page-components/Admin/AdminCategories";
import getCategories from "@/utils/server/get/getCategories";
import getUser from "@/utils/server/get/getUser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { FC, useState } from "react";
import styles from "../../styles/Admin.module.scss";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import { ICategory } from "@/utils/server/get/getCategory";

interface IProps {
  categories: ICategory[];
}

const Categories: FC<IProps> = ({ categories }) => {
  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Игры Кодебай | Категории</title>
      </Head>
      <div className={styles.admin}>
        <AdminLayout setAdd={setAdd} setEdit={setEdit}>
          {add ? (
            <AddCategory type="add" setAdd={setAdd} />
          ) : edit ? (
            <AddCategory type="edit" setEdit={setEdit} />
          ) : (
            <AdminCategories categories={categories} setEdit={setEdit} />
          )}
        </AdminLayout>
      </div>
    </>
  );
};

export default withLayout(Categories, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    id: session?.user.id!,
    token: session?.user.token!,
  });

  if (user?.role === "администратор") {
    const categories = await getCategories({
      limit: 30,
      token: session?.user.token!,
      hidden: false,
    });

    return {
      props: {
        categories: categories || [],
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
}
