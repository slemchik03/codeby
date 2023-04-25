import { NewsCard } from "@/page-components/NewsCard";
import {  setNewsToUpdate } from "@/redux/admin/slice";
import { INews } from "@/utils/server/get/getNews";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./AdminNews.module.scss";

interface IProps {
  news: INews[];
  setEdit: (v: boolean) => void;
}

export const AdminNews: FC<IProps> = ({ news, setEdit }) => {
  const dispatch = useDispatch();
  return (
    <div className={styles.adminNews}>
      {news?.map((newsItem) => {
        const { title, description, created_at, id, hidden } = newsItem;
        return (
          <NewsCard
            id={id}
            key={id}
            setEdit={(v) => {
              setEdit(v);
              dispatch(setNewsToUpdate(newsItem));
            }}
            hidden={hidden}
            settings
            created_at={created_at}
            title={title}
            description={description}
            color="black"
            className={styles.card}
          />
        );
      })}
    </div>
  );
};
