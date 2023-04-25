import styles from "./AdminCategories.module.scss";
import { FC } from "react";
import { useDispatch } from "react-redux";
import { setCategoryToUpdate } from "@/redux/admin/slice";
import { ICategory } from "@/utils/server/get/getCategory";
import { AdminCategoryCard } from "@/page-components/Categories/CategoryCard/AdminCategoryCard";

interface IProps {
  setEdit: (v: boolean) => void;
  categories: ICategory[];
}

export const AdminCategories: FC<IProps> = ({ setEdit, categories }) => {
  const dispatch = useDispatch();
  return (
    <ul className={styles.adminCategories}>
      {categories?.map((category, idx) => {
        const { image, title, description, hidden, id } = category;
        return (
          <li key={idx}>
            <AdminCategoryCard
              id={id}
              setEdit={(v) => {
                setEdit(v);
                dispatch(setCategoryToUpdate(category));
              }}
              
              hidden={hidden}
              className={styles.card}
              image={image}
              title={title}
              desc={description}
            />
          </li>
        );
      })}
    </ul>
  );
};
