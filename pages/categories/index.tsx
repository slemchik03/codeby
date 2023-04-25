import { withLayout } from "@/layout/Layout";
import styles from "../../styles/Categories.module.scss";
import Link from "next/link";
import getCategories from "@/utils/server/get/getCategories";
import { FC } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import getScoreboardCategories, {
  IScoreboardCategories,
} from "@/utils/server/get/getScoreboardCategories";
import Head from "next/head";
import { ICategory } from "@/utils/server/get/getCategory";
import { UserCategoryCard } from "@/page-components/Categories/CategoryCard/UserCategoryCard";
import getUser from "@/utils/server/get/getUser";

interface IProps {
  categoriesList: ICategory[];
  categoriesScoreboard: IScoreboardCategories;
}

const Categories: FC<IProps> = ({ categoriesList, categoriesScoreboard }) => {
  return (
    <>
      <Head>
        <title>Игры Кодебай | Категории</title>
      </Head>
      <ul className={styles.categories}>
        {categoriesList.map(({ id, image, title, description, slug }) => {
          const category = categoriesScoreboard?.categories?.find(
            ({ id: id1 }) => id1 === id
          );
          return (
            <li key={id}>
              <Link href={"/categories/" + slug}>
                <UserCategoryCard
                  id={id}
                  image={image}
                  title={title}
                  desc={description}
                  allTasks={category ? category.all_tasks : 1}
                  completedTasks={category ? category.completed_tasks : 0}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default withLayout(Categories, "protected");

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const user = await getUser({
    token: session?.user.token!,
    id: session?.user.id!,
  });
  const categories = await getCategories({
    limit: 20,
    token: session?.user.token!,
    hidden: false,
  });
  const categoriesScoreboard = await getScoreboardCategories({
    token: session?.user.token!,
    teamId: user?.team_id!,
  });
  return {
    props: {
      categoriesList: Array.isArray(categories) ? categories : [],
      categoriesScoreboard,
      session,
    },
  };
};
