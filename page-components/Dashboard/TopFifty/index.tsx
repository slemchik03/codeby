import { FC, useMemo, useState } from "react";
import ReactPaginate from "react-paginate";
import styles from "./TopFifty.module.scss";
import clsx from "clsx";
import { IScoreboardList } from "@/utils/server/get/getScoreboardList";
import Link from "next/link";

interface IProps {
  scoreboard: IScoreboardList[];
}

export const TopFifty: FC<IProps> = ({ scoreboard }) => {
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 10;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = scoreboard?.slice(itemOffset, endOffset);

  const pageCount = Math.ceil(scoreboard?.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % scoreboard?.length;
    setItemOffset(newOffset);
  };

  return (
    <div className={styles.topFifty}>
      <div className={styles.top}>
        <span>№</span>
        <span>Логин</span>
        <span>Баллы</span>
        <span>Решено заданий</span>
      </div>

      <ul className={styles.list} style={{ textAlign: "left" }}>
        {currentItems &&
          currentItems.map(({ team, points, completed_tasks }, idx) => {

            return (
              <Link key={idx} href={`/team/${team.id}`}>
                <li
                  className={clsx(styles.item, { [styles.oddUser]: idx % 2 })}
                  key={team?.id}
                >
                  <span>{itemOffset + idx + 1}</span>
                  <span>{team?.name}</span>
                  <span>{points}</span>
                  <span>{completed_tasks}</span>
                </li>
              </Link>
            );
          })}
      </ul>
      <div className={styles.pagination}>
        <ReactPaginate
          nextLabel=">"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={undefined}
          disableInitialCallback={true}
          containerClassName="paginationButtons"
          previousLinkClassName="prevButton"
          nextLinkClassName="nextButton"
          disabledClassName="disabledButton"
          activeClassName="activeButton"
        />
      </div>
    </div>
  );
};
