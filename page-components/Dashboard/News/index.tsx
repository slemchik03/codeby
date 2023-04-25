import { NewsCard } from "@/page-components/NewsCard";
import { INews } from "@/utils/server/get/getNews";
import {FC, useEffect, useState} from "react";
import styles from "./News.module.scss";
import {NoNews} from "@/page-components/Dashboard/News/NoNews";

interface IProps {
  newsList: INews[];
}

export const News: FC<IProps> = ({ newsList }) => {
  return (
    <div className={styles.news}>
      {newsList.length ? (
        newsList?.map(({created_at, title, description, id}) => (
          /* @ts-ignore does not matter */
            <NewsCard
              key={id}
              description={description}
              title={title}
              created_at={created_at}
              color="gray"
              className={styles.card}
            />
          )
        )
      ) : (
        <NoNews />
      )
      }
    </div>
  );
};
